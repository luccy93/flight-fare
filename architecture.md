# Architecture Overview

## System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────┐
│   Browser    │────▶│   Nginx      │────▶│  Frontend  │
│  (Client)    │     │  (Reverse    │     │  Next.js   │
└─────────────┘     │   Proxy)     │     └───────────┘
                    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐     ┌───────────┐
                    │   Backend     │────▶│  PostgreSQL│
                    │   FastAPI     │     └───────────┘
                    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐     ┌───────────┐
                    │    Redis      │     │    ML      │
                    │   (Cache)     │     │   Models   │
                    └──────────────┘     └───────────┘
```

## Data Flow

1. User submits flight details via frontend form
2. Request goes through Nginx reverse proxy → Backend API
3. Backend checks Redis cache for existing prediction
4. If cache miss, calls ML model to generate prediction
5. Stores prediction in PostgreSQL for history
6. Caches result in Redis (10 min TTL)
7. Returns prediction to frontend with visualization

## Scalability

- Horizontal scaling via Kubernetes HPA
- Database connection pooling via SQLAlchemy + AsyncPG
- Redis caching reduces ML model calls
- Nginx load balancing across backend instances
- CDN for static frontend assets
