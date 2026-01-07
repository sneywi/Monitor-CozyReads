#!/usr/bin/env bash
set -euo pipefail

NODE_EXPORTER_VERSION="1.10.2"
BASE_DIR="$(pwd)"
INSTALL_DIR="$BASE_DIR/node_exporter"

echo "▶ Installing Node Exporter v${NODE_EXPORTER_VERSION}"

# Create install directory
mkdir -p "$INSTALL_DIR"
cd "$BASE_DIR"

# Download
wget -q https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz

# Extract
tar -xzf node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz

# Move binary
mv node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64/node_exporter "$INSTALL_DIR/"

# Cleanup
rm -rf node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64*

echo "Node Exporter installed!"
