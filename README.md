# Flight Fare Prediction

**Live Demo:** [https://flight-fare-ten.vercel.app](https://flight-fare-ten.vercel.app)  

A production-grade machine learning application that predicts flight ticket prices based on travel parameters. Built with FastAPI, Next.js, PostgreSQL, and Redis, with comprehensive monitoring and CI/CD.

## Features

- **Price Prediction** - ML-powered flight fare estimation using ensemble models (Random Forest, XGBoost, CatBoost, LightGBM)
- **User Authentication** - JWT-based auth with access/refresh tokens, password reset flow
- **Route Management** - Save and manage frequently traveled routes
- **Prediction History** - Track and review past predictions
- **Price Categories** - Low/Medium/High fare classification with recommendations
- **Interactive UI** - Modern React dashboard with real-time visualizations
- **API Documentation** - Auto-generated OpenAPI/Swagger docs at `/docs`
- **Comprehensive Monitoring** - Prometheus metrics, Grafana dashboards, structured logging
- **Containerized** - Docker Compose for local dev, Kubernetes for production
- **CI/CD Pipeline** - Automated testing, building, and deployment via GitHub Actions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Models** | Scikit-learn, XGBoost, CatBoost, LightGBM |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0, AsyncPG |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Database** | PostgreSQL 16 (primary), Redis 7 (cache/sessions) |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **Infrastructure** | Docker, Docker Compose, Kubernetes |
| **Monitoring** | Prometheus, Grafana, structured logging |
| **CI/CD** | GitHub Actions, Docker Buildx, Kustomize |
| **Reverse Proxy** | Nginx (rate limiting, SSL, compression) |

## Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- Kubernetes cluster (for k8s deployment)
- kubectl & kustomize (for k8s deployment)
- PostgreSQL 16 (for local development without Docker)

## Quick Start (Docker)

```bash
# Clone and enter the project
cd flight-fare-prediction

# Start all services
docker compose up --build

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
Prometheus: http://localhost:9090
Grafana: http://localhost:3001 (admin/admin)
```

## Local Development Setup

### Backend

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
pip install -r ml/requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL and Redis (or use Docker for them)
# docker compose up postgres redis -d

# Train ML model
cd ml
python train.py

# Start backend
cd ../backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Train ML Model

```bash
cd ml
pip install -r requirements.txt
python train.py
```

The training pipeline:
1. Loads data from `Data_Train.xlsx`
2. Cleans and removes outliers (IQR method)
3. Engineers features (date parsing, duration, one-hot encoding)
4. Trains Random Forest, XGBoost, CatBoost, and LightGBM
5. Selects the best model by R2 score
6. Saves model and preprocessor artifacts to `ml/models/`

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login, returns JWT tokens |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/me` | GET | Get current user profile |

### Predictions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | POST | Predict flight fare |
| `/api/predictions` | GET | Get prediction history |
| `/api/predictions/{id}` | GET | Get prediction details |
| `/api/predictions/{id}` | DELETE | Delete a prediction |

### Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/routes` | GET | List saved routes |
| `/api/routes` | POST | Save a new route |
| `/api/routes/{id}` | PUT | Update saved route |
| `/api/routes/{id}` | DELETE | Delete saved route |
| `/api/routes/{id}/check-price` | GET | Check price for saved route |

### System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/metrics` | GET | Prometheus metrics |
| `/docs` | GET | Swagger UI |

### Prediction Request Body

```json
{
  "airline": "IndiGo",
  "source": "Bangalore",
  "destination": "New Delhi",
  "departure_date": "24/03/2024",
  "departure_time": "22:20",
  "arrival_time": "01:10",
  "total_stops": "non-stop",
  "cabin_class": null
}
```

### Prediction Response

```json
{
  "predicted_price": 6543.21,
  "confidence_score": 0.92,
  "price_category": "Medium",
  "recommendation": "The predicted fare is medium. Book 3-4 weeks in advance for best prices.",
  "cheapest_booking_window": "3-4 weeks before departure"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres@localhost:5432/flight_fare` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `SECRET_KEY` | JWT signing key | Change in production |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `7` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | `http://localhost:8000` |
| `ENVIRONMENT` | Runtime environment | `development` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `GRAFANA_ADMIN_USER` | Grafana admin user | `admin` |
| `GRAFANA_ADMIN_PASSWORD` | Grafana admin password | `admin` |

## Deployment Guide

### Docker Compose (Single Server)

```bash
docker compose up --build -d
```

### Kubernetes

```bash
# Apply entire stack
kubectl apply -k kubernetes/

# Check deployment status
kubectl get pods -n flight-fare
kubectl get svc -n flight-fare

# Port-forward for local access
kubectl port-forward -n flight-fare service/backend-service 8000:8000
kubectl port-forward -n flight-fare service/frontend-service 3000:3000
```

### AWS EKS

1. Create EKS cluster with `eksctl`
2. Configure kubectl context
3. Install NGINX Ingress Controller
4. Install cert-manager for TLS
5. Apply manifests: `kubectl apply -k kubernetes/`
6. Configure Route53 DNS to point to Ingress LB

### Railway

1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy backend and frontend as separate services
4. Use Railway PostgreSQL and Redis plugins

### Render

1. Create a Web Service for backend
2. Create a Static Site for frontend
3. Set environment variables
4. Use Render PostgreSQL and Redis

### Vercel (Frontend Only)

1. Deploy backend separately (Railway/Render)
2. Connect frontend repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` to backend URL
4. Deploy

### DigitalOcean App Platform

1. Create App from GitHub
2. Add backend and frontend components
3. Add PostgreSQL and Redis dev databases
4. Set environment variables
5. Deploy

## Architecture

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Browser │───▶│  Nginx   │───▶│ Frontend │
└──────────┘    │  (Proxy) │    │ (Next.js)│
                └──────────┘    └──────────┘
                       │
                ┌──────▼──────┐
                │   Backend   │
                │  (FastAPI)  │
                └──┬──────┬──┘
                   │      │
          ┌────────▼─┐  ┌─▼────────┐
          │PostgreSQL│  │  Redis   │
          └──────────┘  └──────────┘
```

Data flow:
1. User inputs flight details via the React frontend
2. Request is proxied through Nginx (rate-limited, SSL-terminated)
3. FastAPI backend validates input and retrieves cached predictions from Redis
4. If no cache hit, the ML model predicts the fare
5. Results are stored in PostgreSQL and cached in Redis
6. Response is returned with prediction, confidence score, and recommendation

## Monitoring

### Available Metrics (Prometheus)

- HTTP request rate, duration, and error count
- Prediction request count and latency
- Database connection pool size and query timing
- Redis cache hit/miss ratio
- Memory and CPU usage
- Active users (based on unique user IDs)

### Grafana Dashboard

Accessible at `http://localhost:3001` (admin/admin).

Panels:
- API Request Rate (requests/sec)
- Prediction Latency (P50, P95, P99)
- Error Rate by Status Code (4xx, 5xx)
- Active Users (30m/24h windows)
- Total Predictions Made
- CPU & Memory Usage by Service
- Database Connection Pool
- Redis Cache Hit Ratio
- HTTP Request Duration Heatmap

### Alerts

Configure alert rules in Prometheus for:
- High error rate (>5% 5xx errors in 5m)
- High prediction latency (P99 > 5s)
- Low Redis cache hit ratio (<50%)
- Database connection pool exhaustion
- Pod restarts or crashes

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Config, security, dependencies
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── ml/           # ML inference
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React hooks
│   │   └── lib/          # Utilities
│   └── Dockerfile
├── ml/
│   ├── train.py
│   ├── train_pipeline.py
│   ├── predict.py
│   └── models/           # Trained model artifacts
├── database/
│   ├── init.sql
│   ├── Dockerfile
│   └── migrations/
├── deployment/
│   ├── nginx.conf
│   └── nginx.Dockerfile
├── kubernetes/
│   ├── *.yaml            # K8s manifests
│   └── kustomization.yaml
├── monitoring/
│   ├── prometheus.yml
│   ├── grafana-dashboard.json
│   └── grafana-datasource.yml
├── .github/workflows/
│   └── deploy.yml        # CI/CD pipeline
├── docker-compose.yml
├── .env.example
├── .gitignore
└── .dockerignore
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and tests before submitting.

```bash
# Backend linting
cd backend
ruff check app/
black --check app/

# Frontend linting
cd frontend
npm run lint

# Run tests
cd backend
pytest tests/ -v
```

## License

MIT

## Acknowledgments

- Dataset: Provided flight fare training data
- ML Models: Scikit-learn, XGBoost, CatBoost, LightGBM communities
- Infrastructure: Kubernetes, Docker, Prometheus, Grafana projects
