# PowerShell script to send reminder via OpenClaw
$ErrorActionPreference = "Stop"
try {
    & openclaw message send --channel feishu --target "ou_4ada17db9f0168c4db8a0562cbed64c7" --message "提醒：10:00与品牌沟通助播事项"
    Write-Host "Reminder sent successfully at $(Get-Date)"
} catch {
    Write-Host "Failed to send reminder: $_"
    exit 1
}