# Monitor-CozyReads 🌿

**A Dockerized Node.js microservices e-commerce platform with integrated monitoring and alerting**

Monitor-CozyReads delivers full observability for a Node.js microservices application using Prometheus, Alertmanager, Blackbox Exporter, and Node Exporter.

## Monitor-CozyReads Frontend
<img width="1920" height="1075" alt="Screenshot from 2026-01-05 20-19-23" src="https://github.com/user-attachments/assets/d7dbeedf-c1b8-452d-9a72-f2958b0f925d" />
<img width="1919" height="1079" alt="Screenshot from 2026-01-05 21-21-57" src="https://github.com/user-attachments/assets/56c0f751-4214-48f1-afab-39a615cb213e" />

✦ VM1 - Application VM: Frontend + Node.js microservices + Node Exporter  

✦ VM2 - Monitoring VM: Prometheus, Alertmanager, Blackbox Exporter, Grafana

## The Problem

Running microservices without monitoring leads to:

➜ **No visibility** - Can't see which service is down

➜ **Late detection** - Find out from angry customers, not alerts  

➜ **Revenue loss** - Downtime = lost sales

➜ **No root cause** - Was it CPU? Memory? Network?

➜ **Manual checks** - Wasting time SSH-ing into servers

➜ **No metrics** - Can't optimize what you can't measure

## ✰ The Solution

Monitor-CozyReads transforms chaos into control with automated monitoring.

### What It Does

1. **Monitors** - Tracks frontend availability, backend services, and system resources
2. **Detects** - Identifies issues in real-time (< 2 minutes)
3. **Alerts** - Sends beautiful email notifications with actionable details
4. **Visualizes** - Grafana dashboards show metrics at a glance
5. **Prevents** - Catches problems before they become outages

## ## Architecture Overview

**Presentation - Nginx serving static frontend**

**Application - 5 Node.js microservices**
- user-service
- product-service
- cart-service
- order-service
- payment-service

**Monitoring Stack**
- **Prometheus** - Metrics collection & alerting engine
- **Grafana** - Beautiful dashboards (import IDs: 1860, 7587)
- **Alertmanager** - Smart alert routing & deduplication
- **Blackbox Exporter** - HTTP endpoint monitoring
- **Node Exporter** - System metrics (CPU, RAM, Disk)

**6 Essential Alerts**
- Frontend Down
- Microservice Down  
- Monitoring Exporter Down
- High Memory (>85%)
- Disk Space Low (<15%)
- High CPU (>80%)

## Ports Summary

| Service | Port |
|---------|------|
| Frontend | 8080 |
| User Service | 3001 |
| Product Service | 3002 |
| Cart Service | 3003 |
| Order Service | 3004 |
| Payment Service | 3005 |
| Prometheus | 9090 |
| Alertmanager | 9093 |
| Blackbox Exporter | 9115 |
| Node Exporter | 9100 |
| Grafana | 3000 |

---

## Prerequisites

- Git
- Docker 
- Docker Compose 

Verify installation:
```bash
docker --version
docker compose version
```

## How to Use This Repo

### Step 1: Clone the repository
```bash
git clone https://github.com/yourusername/Monitor-CozyReads.git
cd Monitor-CozyReads
```

### Step 2: Build application services
```bash
docker-compose build --no-cache
docker-compose up -d
```

Verify micro-services are running:
```bash
docker-compose ps
```

Access the Monitor-CozyReads application[Frontend]:
```
http://localhost:8080
```

### Step 3: Install monitoring components (Monitoring VM)

Install Alertmanager, Blackbox, Prometheus:
```bash
cd monitoring
chmod +x alertmanager.sh blackbox.sh prometheus.sh

./alertmanager.sh
./blackbox.sh
./prometheus.sh
```

Install Node Exporter:
```bash
# From project root
chmod +x node_exporter.sh
./node_exporter.sh
```

### Step 4: Configure email alerts

Update Alertmanager config:
```bash
vi monitoring/alertmanager/alertmanager.yml
```
Get Gmail app password at: https://myaccount.google.com/apppasswords
Then, add your Gmail credentials:
```yaml
global:
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-16-char-app-password'
```

### Step 5: Start monitoring components
In the Monitoring VM -
Start Alertmanager:
```bash
cd monitoring/alertmanager
./alertmanager &
```
Start Prometheus:
```bash
cd monitoring/prometheus
./prometheus &
```
Start Blackbox Exporter:
```bash
cd monitoring/blackbox
./blackbox_exporter &
```
Start Node Exporter (In the Application VM):
```bash
cd Monitor-CozyReads/node_exporter
./node_exporter &
```

### Step 6: Access them

Access Alertmanager:
```bash
http://localhost:9093
```
Access Prometheus:
```bash
http://localhost:9090
```
Access Blackbox Exporter:
```bash
http://localhost:9115
```
Access Node Exporter:
```bash
http://localhost:9100
```
Access Grafana:
```bash
http://localhost:3000
```

---

## 6 Prometheus Alerts 
<img width="1919" height="1079" alt="Screenshot from 2026-01-05 21-09-25" src="https://github.com/user-attachments/assets/73f7edf7-97e4-4e9e-9651-785ba0888829" />
<img width="1920" height="1080" alt="Screenshot from 2025-12-29 21-44-28" src="https://github.com/user-attachments/assets/d18c17ac-25eb-4f56-a0a1-2b028abab6c6" />

---

## Node Exporter
<img width="1918" height="1077" alt="Screenshot from 2025-12-29 20-06-31" src="https://github.com/user-attachments/assets/baa282ca-80eb-4eab-8506-4ee1eff67b9d" />

---

## Blackbox Exporter
<img width="1920" height="1080" alt="Screenshot from 2025-12-29 21-42-51" src="https://github.com/user-attachments/assets/a92098e1-f612-4dd4-b8f2-1c90e2db9383" />

---

## Email Alert(s) of a Failed service
<img width="1913" height="1076" alt="image" src="https://github.com/user-attachments/assets/7d9f5722-2f91-460a-b83e-aef38b6b25a2" />


## Author

Built by [@sneywi](https://github.com/sneywi)
