# 홈 화면·앱 아이콘 만들기 (2026-09-22)
# 폰에서 "홈 화면에 추가" 했을 때 쓸 아이콘을 브랜드 색(네이비·브라스·아이보리)으로 그린다.
# 실행: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\make-icons.ps1
# 결과: public\apple-touch-icon.png(180) · icon-192.png · icon-512.png · icon-maskable-512.png
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path (Split-Path -Parent $here) 'public'

$navy = [System.Drawing.ColorTranslator]::FromHtml('#0b1f3a')
$ivory = [System.Drawing.ColorTranslator]::FromHtml('#f6f3ec')
$brass = [System.Drawing.ColorTranslator]::FromHtml('#b8924a')

function New-Icon([int]$size, [string]$file, [double]$pad, [bool]$round) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.InterpolationMode = 'HighQualityBicubic'

  # 바탕: 마스크(둥글게 잘림)에 대비해 네이비를 가장자리까지 채운다
  $g.Clear($navy)
  if ($round) {
    # 아이폰은 스스로 모서리를 둥글게 자르므로 사각 그대로 두고, 안쪽 여백만 준다
  }

  # 가운데 세리프 'S'
  $box = $size * (1 - 2 * $pad)
  $fontSize = [float]($box * 0.88)
  $font = New-Object System.Drawing.Font('Georgia', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = 'Center'; $fmt.LineAlignment = 'Center'
  $brushIvory = New-Object System.Drawing.SolidBrush($ivory)
  $rect = New-Object System.Drawing.RectangleF(0, [float](-$size * 0.07), [float]$size, [float]$size)
  $g.DrawString('S', $font, $brushIvory, $rect, $fmt)

  # 브라스 밑줄 (수트와후드의 금색 강조선)
  $lineW = [float]($size * 0.30)
  $lineH = [math]::Max(2, [float]($size * 0.035))
  $lx = ($size - $lineW) / 2
  $ly = $size * 0.70
  $brushBrass = New-Object System.Drawing.SolidBrush($brass)
  $g.FillRectangle($brushBrass, $lx, $ly, $lineW, $lineH)

  $path = Join-Path $out $file
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $font.Dispose(); $brushIvory.Dispose(); $brushBrass.Dispose()
  Write-Host ("  {0} ({1}x{1})" -f $file, $size)
}

Write-Host '아이콘을 만듭니다 →' $out
New-Icon 180 'apple-touch-icon.png' 0.18 $true      # 아이폰 홈 화면
New-Icon 192 'icon-192.png' 0.18 $true              # 안드로이드 기본
New-Icon 512 'icon-512.png' 0.18 $true              # 안드로이드 큰 아이콘·스플래시
New-Icon 512 'icon-maskable-512.png' 0.30 $true     # 안드로이드가 원형으로 잘라도 글자가 안 잘리게 여백을 더 준다
Write-Host '끝났습니다.'
