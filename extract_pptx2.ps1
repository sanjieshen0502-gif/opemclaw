# Find PPTX files on desktop
$desktop = [Environment]::GetFolderPath("Desktop")
Write-Host "Desktop path: $desktop"

# Find PPTX files containing Chinese characters
$pptFiles = Get-ChildItem $desktop -Filter "*.pptx" 
Write-Host "Found PPTX files:"
$pptFiles | ForEach-Object { Write-Host "  - $($_.Name) ($($_.Length) bytes)" }

if ($pptFiles.Count -eq 0) {
    Write-Host "No PPTX files found"
    exit 1
}

# Use first PPTX file
$pptFile = $pptFiles[0]
Write-Host "`nProcessing file: $($pptFile.Name)"

# Copy to workspace
$workspacePath = "C:\Users\Komorebi\.openclaw\workspace\presentation.pptx"
Copy-Item $pptFile.FullName -Destination $workspacePath -Force
Write-Host "Copied to workspace: $workspacePath"

# Check file exists
if (Test-Path $workspacePath) {
    $fileInfo = Get-Item $workspacePath
    Write-Host "File info:"
    Write-Host "  Name: $($fileInfo.Name)"
    Write-Host "  Size: $($fileInfo.Length) bytes"
    Write-Host "  Modified: $($fileInfo.LastWriteTime)"
    
    # Extract PPTX (it's a ZIP file)
    $extractDir = "C:\Users\Komorebi\.openclaw\workspace\pptx_extracted"
    if (Test-Path $extractDir) {
        Remove-Item $extractDir -Recurse -Force
    }
    
    try {
        Expand-Archive -Path $workspacePath -DestinationPath $extractDir -Force
        Write-Host "`nPPTX extracted to: $extractDir"
        
        # Read slide content
        $slideDir = Join-Path $extractDir "ppt/slides"
        if (Test-Path $slideDir) {
            $slides = Get-ChildItem $slideDir -Filter "slide*.xml" | Sort-Object Name
            Write-Host "`nFound slides: $($slides.Count)"
            
            foreach ($slide in $slides) {
                Write-Host "`n=== Slide: $($slide.Name) ==="
                $content = Get-Content $slide.FullName -Raw -Encoding UTF8
                
                # Extract text from <a:t> elements
                $textMatches = [regex]::Matches($content, '<a:t[^>]*>([^<]+)</a:t>')
                foreach ($match in $textMatches) {
                    $text = $match.Groups[1].Value.Trim()
                    if ($text) {
                        Write-Host "Text: $text"
                    }
                }
            }
        } else {
            Write-Host "Slide directory not found"
        }
    } catch {
        Write-Host "Extraction failed: $_"
    }
} else {
    Write-Host "File copy failed"
}