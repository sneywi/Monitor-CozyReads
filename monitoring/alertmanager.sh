#!/usr/bin/env bash
set -euo pipefail

ALERTMANAGER_VERSION="0.30.0"
BASE_DIR="$(pwd)"
INSTALL_DIR="$BASE_DIR/alertmanager"
TEMPLATES_DIR="$INSTALL_DIR/templates"

echo "▶ Installing Alertmanager v${ALERTMANAGER_VERSION}"

# 1. Create directories
mkdir -p "$TEMPLATES_DIR"

# 2. Download Alertmanager
cd "$BASE_DIR"
wget -q https://github.com/prometheus/alertmanager/releases/download/v${ALERTMANAGER_VERSION}/alertmanager-${ALERTMANAGER_VERSION}.linux-amd64.tar.gz

# 3. Extract
tar -xzf alertmanager-${ALERTMANAGER_VERSION}.linux-amd64.tar.gz

# 4. Move files
mv alertmanager-${ALERTMANAGER_VERSION}.linux-amd64/* "$INSTALL_DIR/"

# 5. Cleanup
rm -rf alertmanager-${ALERTMANAGER_VERSION}.linux-amd64*
echo "✔ Alertmanager binaries installed"

# 6. Write alertmanager.yml
cat <<'EOF' > "$INSTALL_DIR/alertmanager.yml"
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'from-email@gmail.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'google-app-pass-word'
  smtp_require_tls: true

# Use absolute path
templates:
  - '/home/ubuntu/Monitor-CozyReads/monitoring/alertmanager/templates/*.tmpl'

route:
  receiver: 'email-notifications'
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

  routes:
    - match:
        severity: critical
      receiver: 'email-critical'
      group_wait: 10s
      repeat_interval: 1h

    - match:
        severity: warning
      receiver: 'email-warnings'
      group_wait: 5m
      repeat_interval: 12h

receivers:
  - name: 'email-notifications'
    email_configs:
      - to: 'your-email@gmail.com'
        headers:
          Subject: '🔔 CozyReads Alert: {{ .GroupLabels.alertname }}'
        html: '{{ template "email.html" . }}'
        send_resolved: true

  - name: 'email-critical'
    email_configs:
      - to: 'your-email@gmail.com'
        headers:
          Subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }} - CozyReads'
        html: '{{ template "email.html" . }}'
        send_resolved: true

  - name: 'email-warnings'
    email_configs:
      - to: 'your-email@gmail.com'
        headers:
          Subject: '⚠️  WARNING: {{ .GroupLabels.alertname }} - CozyReads'
        html: '{{ template "email.html" . }}'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
EOF

echo "✔ alertmanager.yml created"

# 7. Write email template
cat <<'EOF' > "$TEMPLATES_DIR/email.tmpl"
{{ define "email.html" }}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            font-size: 15px;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
        }
        .header {
            padding: 32px 32px 24px;
            border-bottom: 1px solid #e5e5e5;
        }
        .status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .status.firing {
            background-color: #fee;
            color: #c41e3a;
        }
        .status.resolved {
            background-color: #e6f7e6;
            color: #1e7b34;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
        }
        .content {
            padding: 32px;
        }
        .alert {
            margin-bottom: 32px;
            padding-bottom: 32px;
            border-bottom: 1px solid #e5e5e5;
        }
        .alert:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .alert-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
        }
        .alert-name.critical::before {
            content: "● ";
            color: #c41e3a;
        }
        .alert-name.warning::before {
            content: "● ";
            color: #f59e0b;
        }
        .field {
            margin-bottom: 16px;
        }
        .field-label {
            font-size: 13px;
            font-weight: 500;
            color: #666;
            margin-bottom: 4px;
        }
        .field-value {
            font-size: 15px;
            color: #1a1a1a;
        }
        .impact {
            background-color: #fffbeb;
            border-left: 3px solid #f59e0b;
            padding: 16px;
            margin: 16px 0;
        }
        .impact-label {
            font-size: 13px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 4px;
        }
        .impact-text {
            font-size: 14px;
            color: #78350f;
        }
        .timestamp {
            font-size: 13px;
            color: #666;
            margin-top: 12px;
        }
        .actions {
            padding: 24px 32px;
            background-color: #fafafa;
            border-top: 1px solid #e5e5e5;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 0 4px;
            background-color: #1a1a1a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
        }
        .footer {
            padding: 24px 32px;
            text-align: center;
            font-size: 13px;
            color: #999;
        }
        .footer-brand {
            font-weight: 600;
            color: #666;
            margin-bottom: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            {{ if eq .Status "firing" }}
            <div class="status firing">Firing</div>
            <h1 class="title">Alert Triggered</h1>
            {{ else }}
            <div class="status resolved">Resolved</div>
            <h1 class="title">Alert Resolved</h1>
            {{ end }}
        </div>

        <div class="content">
            {{ range .Alerts }}
            <div class="alert">
                <div class="alert-name {{ .Labels.severity }}">
                    {{ .Labels.alertname }}
                </div>

                <div class="field">
                    <div class="field-label">Summary</div>
                    <div class="field-value">{{ .Annotations.summary }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Description</div>
                    <div class="field-value">{{ .Annotations.description }}</div>
                </div>

                {{ if .Annotations.impact }}
                <div class="impact">
                    <div class="impact-label">Impact</div>
                    <div class="impact-text">{{ .Annotations.impact }}</div>
                </div>
                {{ end }}

                <div class="field">
                    <div class="field-label">Severity</div>
                    <div class="field-value">{{ .Labels.severity }}</div>
                </div>

                {{ if .Labels.instance }}
                <div class="field">
                    <div class="field-label">Instance</div>
                    <div class="field-value">{{ .Labels.instance }}</div>
                </div>
                {{ end }}

                {{ if .Labels.service }}
                <div class="field">
                    <div class="field-label">Service</div>
                    <div class="field-value">{{ .Labels.service }}</div>
                </div>
                {{ end }}

                {{ if .Labels.job }}
                <div class="field">
                    <div class="field-label">Job</div>
                    <div class="field-value">{{ .Labels.job }}</div>
                </div>
                {{ end }}

                <div class="timestamp">
                    {{ if eq .Status "firing" }}
                    Started: {{ .StartsAt.Format "Jan 02, 2006 at 15:04 MST" }}
                    {{ else }}
                    Resolved: {{ .EndsAt.Format "Jan 02, 2006 at 15:04 MST" }}
                    {{ end }}
                </div>
            </div>
            {{ end }}
        </div>

        <div class="actions">
            <a href="http://localhost:9090/alerts" class="button">View Prometheus</a>
            <a href="http://localhost:3000" class="button">View Grafana</a>
        </div>

        <div class="footer">
            <div class="footer-brand">CozyReads Monitoring</div>
            <div>Automated alert from Alertmanager</div>
        </div>
    </div>
</body>
</html>
{{ end }}
EOF

echo "✔ Email template created"

echo "Alertmanager installation complete!"