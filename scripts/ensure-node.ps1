$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

try {
  $runtimeRoot = Join-Path $env:LOCALAPPDATA "LabFlowPro"
  $cachedNodeFile = Join-Path $runtimeRoot "node-home.txt"
  if (Test-Path $cachedNodeFile) {
    $cachedNode = (Get-Content -LiteralPath $cachedNodeFile -Raw).Trim()
    if ((Test-Path (Join-Path $cachedNode "node.exe")) -and
        (Test-Path (Join-Path $cachedNode "npm.cmd"))) {
      Write-Output $cachedNode
      exit 0
    }
  }

  $releases = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json"
  $release = $null
  foreach ($item in $releases) {
    if ($item.version -like "v24.*" -and $item.version -notlike "*-*") {
      $release = $item
      break
    }
  }
  if (-not $release) {
    throw "Could not find a stable Node.js 24 release."
  }

  $architecture = switch ($env:PROCESSOR_ARCHITECTURE) {
    "AMD64" { "x64" }
    "ARM64" { "arm64" }
    default { throw "Unsupported Windows architecture: $env:PROCESSOR_ARCHITECTURE" }
  }

  $version = $release.version
  $nodeDirectory = Join-Path $runtimeRoot "node-${version}-win-${architecture}"
  if (-not (Test-Path (Join-Path $nodeDirectory "node.exe"))) {
    New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
    $archiveName = "node-${version}-win-${architecture}.zip"
    $downloadId = [guid]::NewGuid().ToString("N")
    $archivePath = Join-Path $env:TEMP "${downloadId}-${archiveName}"
    $checksumsPath = Join-Path $env:TEMP "${downloadId}-SHASUMS256.txt"
    $downloadUrl = "https://nodejs.org/dist/${version}/${archiveName}"
    $curl = Get-Command curl.exe -ErrorAction Stop

    try {
      & $curl.Source -L --fail --silent --show-error $downloadUrl -o $archivePath
      if ($LASTEXITCODE -ne 0) {
        throw "Could not download the Node.js archive."
      }
      & $curl.Source -L --fail --silent --show-error "https://nodejs.org/dist/${version}/SHASUMS256.txt" -o $checksumsPath
      if ($LASTEXITCODE -ne 0) {
        throw "Could not download the Node.js archive checksum."
      }
      $checksumLine = Get-Content -LiteralPath $checksumsPath |
        Where-Object { $_ -match "\s+$([regex]::Escape($archiveName))$" } |
        Select-Object -First 1
      if (-not $checksumLine) {
        throw "Could not find the Node.js archive checksum."
      }

      $expectedHash = ($checksumLine -split "\s+")[0]
      $actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
      if ($actualHash -ne $expectedHash) {
        throw "The downloaded Node.js archive failed its checksum."
      }
      Expand-Archive -LiteralPath $archivePath -DestinationPath $runtimeRoot -Force
    } finally {
      Remove-Item -LiteralPath $archivePath -Force -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath $checksumsPath -Force -ErrorAction SilentlyContinue
    }
  }

  if (-not (Test-Path (Join-Path $nodeDirectory "npm.cmd"))) {
    throw "The downloaded Node.js archive does not contain npm."
  }

  Set-Content -LiteralPath $cachedNodeFile -Value $nodeDirectory -NoNewline
  Write-Output $nodeDirectory
} catch {
  Write-Error ("Node.js setup failed: " + $_.Exception.Message)
  exit 1
}
