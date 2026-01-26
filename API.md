# API Documentation (Future)

This document outlines the planned API endpoints for the A1.j7.no autonomous website.

## Overview

The A1.j7.no API will provide programmatic access to autonomous updates, content, and system status. All endpoints will use HTTPS and return JSON responses.

**Base URL**: `https://a1.j7.no/api/v1/`

**Note**: This is a static GitHub Pages site currently. API endpoints will be implemented using GitHub Actions + external serverless functions (e.g., Vercel, Cloudflare Workers, or AWS Lambda).

## Planned Endpoints

### System Status

#### GET /status
Get current system status

**Response:**
```json
{
  "status": "operational",
  "timestamp": "2026-01-26T13:00:00Z",
  "services": {
    "website": "operational",
    "deployments": "operational",
    "autonomous": "operational",
    "integrations": "operational"
  },
  "metrics": {
    "uptime": "99.9%",
    "deploymentsToday": 3,
    "autonomousUpdates": 15,
    "responseTime": "89ms"
  }
}
```

### Content

#### GET /content/latest
Get latest autonomous content updates

**Response:**
```json
{
  "updates": [
    {
      "id": 1,
      "type": "blog_post",
      "title": "Latest Autonomous Update",
      "content": "...",
      "timestamp": "2026-01-26T09:00:00Z",
      "createdBy": "autonomous"
    }
  ]
}
```

#### GET /content/{id}
Get specific content by ID

**Parameters:**
- `id` (required): Content ID

**Response:**
```json
{
  "id": 1,
  "type": "blog_post",
  "title": "Specific Content",
  "content": "...",
  "timestamp": "2026-01-26T09:00:00Z",
  "metadata": {}
}
```

### Analytics

#### GET /analytics/summary
Get analytics summary

**Response:**
```json
{
  "period": "30d",
  "pageViews": 1234,
  "uniqueVisitors": 567,
  "topPages": [
    {"url": "/", "views": 800},
    {"url": "/status.html", "views": 234}
  ]
}
```

### Autonomous Operations

#### GET /autonomous/schedule
Get autonomous update schedule

**Response:**
```json
{
  "nextUpdate": "2026-01-27T09:00:00Z",
  "frequency": "daily",
  "lastUpdate": "2026-01-26T09:00:00Z",
  "timezone": "UTC"
}
```

#### POST /autonomous/trigger
Manually trigger autonomous update (authenticated)

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "jobId": "abc123",
  "status": "queued",
  "estimatedCompletion": "2026-01-26T13:05:00Z"
}
```

## Authentication

For protected endpoints:

```
Authorization: Bearer <your-api-token>
```

API tokens can be generated through GitHub repository settings.

## Rate Limiting

- Public endpoints: 60 requests per hour
- Authenticated endpoints: 5000 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1643205600
```

## Error Responses

All errors return appropriate HTTP status codes with JSON body:

```json
{
  "error": {
    "code": "not_found",
    "message": "Resource not found",
    "timestamp": "2026-01-26T13:00:00Z"
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Webhooks (Future)

Subscribe to autonomous updates via webhooks:

```json
{
  "event": "content.created",
  "timestamp": "2026-01-26T13:00:00Z",
  "payload": {
    "contentId": 123,
    "type": "blog_post"
  }
}
```

## Implementation Notes

### Current Status
- 🟡 **Planning Phase**: API specification in development
- 🟡 **GitHub Pages**: Static site, no server-side API yet
- 🟢 **Status Page**: Available at `/status.html`

### Future Implementation
1. Deploy serverless functions (Vercel/Cloudflare Workers)
2. Integrate with GitHub Actions for autonomous operations
3. Add authentication layer
4. Implement rate limiting
5. Set up monitoring and logging

### Alternatives for Static Site
For now, you can:
- View status at `/status.html`
- Check GitHub Actions for workflow status
- View repository for autonomous updates
- Use GitHub API to query repository data

## Examples

### Using the API (Future)

```javascript
// Fetch latest status
const response = await fetch('https://a1.j7.no/api/v1/status');
const status = await response.json();
console.log(status);

// Get latest content
const contentResponse = await fetch('https://a1.j7.no/api/v1/content/latest');
const content = await contentResponse.json();
console.log(content.updates);
```

### Using GitHub API (Current)

```javascript
// Get latest workflow runs
const response = await fetch('https://api.github.com/repos/fridtjofsen/a1.j7.no/actions/runs');
const runs = await response.json();
console.log(runs.workflow_runs);
```

## Support

For API questions or issues:
- Email: a1@j7.no
- Issues: https://github.com/fridtjofsen/a1.j7.no/issues

---

**Version**: 0.1.0 (Draft)  
**Last Updated**: 2026-01-26
