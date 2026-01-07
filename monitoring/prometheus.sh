#!/usr/bin/env bash
set -euo pipefail

PROMETHEUS_VERSION="3.9.0"
BASE_DIR="$(pwd)"
INSTALL_DIR="$BASE_DIR/prometheus"

echo "▶ Installing Prometheus v${PROMETHEUS_VERSION}"

# 1. Create install directory
mkdir -p "$INSTALL_DIR"

cd "$BASE_DIR"

# 2. Download Prometheus
wget -q https://github.com/prometheus/prometheus/releases/download/v${PROMETHEUS_VERSION}/prometheus-${PROMETHEUS_VERSION}.linux-amd64.tar.gz

# 3. Extract archive
tar -xzf prometheus-${PROMETHEUS_VERSION}.linux-amd64.tar.gz

# 4. Move required files
mv prometheus-${PROMETHEUS_VERSION}.linux-amd64/prometheus "$INSTALL_DIR/"
mv prometheus-${PROMETHEUS_VERSION}.linux-amd64/promtool "$INSTALL_DIR/"
mv prometheus-${PROMETHEUS_VERSION}.linux-amd64/LICENSE "$INSTALL_DIR/"
mv prometheus-${PROMETHEUS_VERSION}.linux-amd64/NOTICE "$INSTALL_DIR/"

# 5. Cleanup extracted files
rm -rf prometheus-${PROMETHEUS_VERSION}.linux-amd64*
echo "✔ Prometheus binaries installed"

# 6. Write prometheus.yml (YOU will customize later)
cat <<'EOF' > "$INSTALL_DIR/prometheus.yml"
# Prometheus Configuration for Monitor-CozyReads
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'cozyreads-production'
    env: 'single-vm-deployment'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

# Load alert rules
rule_files:
  - 'alert_rules.yml'

# Scrape configurations
scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter - System metrics
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']
        labels:
          instance: 'cozyreads-server'
          role: 'app-server'

  # Blackbox Exporter self-metrics
  - job_name: 'blackbox_exporter'
    static_configs:
      - targets: ['localhost:9115']

  # Frontend availability monitoring
  - job_name: 'frontend_probe'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
          - http://localhost:8080
          - http://localhost:8080/login.html
          - http://localhost:8080/cart.html
          - http://localhost:8080/checkout.html
        labels:
          service: 'frontend'
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: localhost:9115

  # Backend microservices monitoring
  - job_name: 'backend_probe'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
          - http://localhost:3001
          - http://localhost:3002
          - http://localhost:3003
          - http://localhost:3004
          - http://localhost:3005
        labels:
          service_type: 'microservice'
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: localhost:9115
EOF

echo "✔ prometheus.yml created"

# 7. Write alert_rules.yml (YOU will customize later)
cat <<'EOF' > "$INSTALL_DIR/alert_rules.yml"
groups:
  - name: cozyreads_critical_alerts
    interval: 30s
    rules:
      # Frontend website down
      - alert: FrontendDown
        expr: probe_success{job="frontend_probe"} == 0
        for: 2m
        labels:
          severity: critical
          service: frontend
        annotations:
          summary: "CozyReads website is unreachable"
          description: "Frontend at {{ $labels.instance }} has been down for 2+ minutes"
          impact: "Users cannot access the website"

      # Backend microservices down
      - alert: MicroserviceDown
        expr: probe_success{job="backend_probe"} == 0
        for: 1m
        labels:
          severity: critical
          service: backend
        annotations:
          summary: "Microservice {{ $labels.instance }} is unreachable"
          description: "Service has been down for 1+ minutes"
          impact: "Core functionality unavailable"

      # Monitoring system failure
      - alert: MonitoringExporterDown
        expr: up{job=~"node_exporter|blackbox_exporter|prometheus"} == 0
        for: 1m
        labels:
          severity: critical
          component: monitoring
        annotations:
          summary: "Monitoring component {{ $labels.job }} is down"
          description: "{{ $labels.job }} at {{ $labels.instance }} is unreachable"
          impact: "Monitoring blind spot - cannot detect issues"

  - name: cozyreads_warning_alerts
    interval: 30s
    rules:
      # High memory usage
      - alert: HighMemoryUsage
        expr: (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 < 15
        for: 5m
        labels:
          severity: warning
          resource: memory
        annotations:
          summary: "Server memory critically low"
          description: "Available memory: {{ $value | humanize }}%"
          impact: "System may crash soon"

      # Low disk space
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
        for: 10m
        labels:
          severity: warning
          resource: disk
        annotations:
          summary: "Disk space critically low"
          description: "Free space: {{ $value | humanize }}%"
          impact: "Services will crash when disk is full"

      # High CPU usage
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
          resource: cpu
        annotations:
          summary: "CPU usage critically high"
          description: "CPU usage: {{ $value | humanize }}%"
          impact: "Slow response times"
EOF

echo "✔ alert_rules.yml created"

echo "Prometheus installation complete!"
