# Create a scheduled job for March 23, 9:55 AM
$trigger = New-JobTrigger -At "2026-03-23 09:55:00" -Once
$options = New-ScheduledJobOption -RunElevated -RequireNetwork
$scriptBlock = {
    & "C:\Users\Komorebi\.openclaw\workspace\send-reminder.ps1"
}
Register-ScheduledJob -Name "BrandCommunicationReminder" -Trigger $trigger -ScriptBlock $scriptBlock -ScheduledJobOption $options
Write-Host "Scheduled job created successfully for 2026-03-23 09:55:00"