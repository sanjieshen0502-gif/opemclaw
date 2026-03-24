# 查找桌面上的PPTX文件
$desktop = [Environment]::GetFolderPath("Desktop")
Write-Host "桌面路径: $desktop"

# 查找包含"美的"的PPTX文件
$pptFiles = Get-ChildItem $desktop -Filter "*.pptx" | Where-Object {$_.Name -match "美的"}
Write-Host "找到的文件:"
$pptFiles | ForEach-Object { Write-Host "  - $($_.Name) ($($_.Length)字节)" }

if ($pptFiles.Count -eq 0) {
    Write-Host "未找到PPTX文件"
    exit 1
}

# 选择第一个文件
$pptFile = $pptFiles[0]
Write-Host "`n处理文件: $($pptFile.Name)"

# 复制到工作区
$workspacePath = "C:\Users\Komorebi\.openclaw\workspace\美的净水器逐字稿.pptx"
Copy-Item $pptFile.FullName -Destination $workspacePath -Force
Write-Host "已复制到工作区: $workspacePath"

# 检查文件是否存在
if (Test-Path $workspacePath) {
    $fileInfo = Get-Item $workspacePath
    Write-Host "文件信息:"
    Write-Host "  名称: $($fileInfo.Name)"
    Write-Host "  大小: $($fileInfo.Length)字节"
    Write-Host "  修改时间: $($fileInfo.LastWriteTime)"
    
    # 尝试读取PPTX内容（解压缩方式）
    $extractDir = "C:\Users\Komorebi\.openclaw\workspace\pptx_extracted"
    if (Test-Path $extractDir) {
        Remove-Item $extractDir -Recurse -Force
    }
    
    try {
        Expand-Archive -Path $workspacePath -DestinationPath $extractDir -Force
        Write-Host "`nPPTX解压成功到: $extractDir"
        
        # 读取幻灯片内容
        $slideDir = Join-Path $extractDir "ppt/slides"
        if (Test-Path $slideDir) {
            $slides = Get-ChildItem $slideDir -Filter "*.xml"
            Write-Host "`n找到幻灯片: $($slides.Count)个"
            
            foreach ($slide in $slides) {
                Write-Host "`n=== 幻灯片: $($slide.Name) ==="
                $content = Get-Content $slide.FullName -Raw
                # 提取文本内容（简单正则）
                $textMatches = [regex]::Matches($content, '<a:t[^>]*>([^<]+)</a:t>')
                foreach ($match in $textMatches) {
                    $text = $match.Groups[1].Value.Trim()
                    if ($text) {
                        Write-Host "文本: $text"
                    }
                }
            }
        } else {
            Write-Host "未找到幻灯片目录"
        }
    } catch {
        Write-Host "解压失败: $_"
    }
} else {
    Write-Host "文件复制失败"
}