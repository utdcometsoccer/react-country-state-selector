# Remove all node_modules folders from git tracking
Get-ChildItem -Path . -Directory -Recurse -Filter node_modules | ForEach-Object {
    git rm -r --cached $_.FullName
    Write-Host "Removed from git: $($_.FullName)"
}
