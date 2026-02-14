# CSS Database Migration
# Run with: npx prisma migrate dev --name add_css_models

## New Models

### CodeScan
Tracks security scan executions against repositories.

### Vulnerability
Individual vulnerability findings with full exploit metadata.

## To Apply

```bash
npx prisma migrate dev --name add_css_models
```

## Rollback

```bash
npx prisma migrate reset
```
