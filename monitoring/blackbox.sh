#!/usr/bin/env bash
set -euo pipefail

BLACKBOX_VERSION="0.25.0"
BASE_DIR="$(pwd)"
INSTALL_DIR="$BASE_DIR/blackbox"

echo "▶ Installing Blackbox Exporter v${BLACKBOX_VERSION}"

# 1. Create install directory
mkdir -p "$INSTALL_DIR"

cd "$BASE_DIR"

# 2. Download Blackbox Exporter
wget -q https://github.com/prometheus/blackbox_exporter/releases/download/v${BLACKBOX_VERSION}/blackbox_exporter-${BLACKBOX_VERSION}.linux-amd64.tar.gz

# 3. Extract archive
tar -xzf blackbox_exporter-${BLACKBOX_VERSION}.linux-amd64.tar.gz

# 4. Move binaries & config
mv blackbox_exporter-${BLACKBOX_VERSION}.linux-amd64/blackbox_exporter "$INSTALL_DIR/"

# 5. Cleanup
rm -rf blackbox_exporter-${BLACKBOX_VERSION}.linux-amd64*
echo "✔ Blackbox Exporter binary installed"

# 6. Write blackbox.yml
cat <<'EOF' > "$INSTALL_DIR/blackbox.yml"
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http:
      valid_http_versions: ["HTTP/1.1", "HTTP/2.0"]
      valid_status_codes: []
      method: GET
      follow_redirects: true
      preferred_ip_protocol: "ip4"
EOF

echo "✔ blackbox.yml created"

echo "Blackbox Exporter installation complete!"