# Integrations

This directory contains integration examples and utilities for connecting to external services.

## Available Integrations

### Database (MySQL)
- File: `database.example.js`
- Purpose: Connect to MySQL database for dynamic content
- Secrets required: `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`

### Email Service
- File: `email.example.js`
- Purpose: Send automated emails
- Secrets required: `EMAIL_API_KEY`

### Bluesky Social
- File: `bluesky.example.js`
- Purpose: Post updates to Bluesky
- Secrets required: `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD`

## Usage

These are example files showing how to integrate with various services. To use them:

1. Copy the example file and remove `.example` from the name
2. Add the file to `.gitignore` if it contains any local configuration
3. Ensure all required secrets are configured in GitHub repository settings
4. Use these integrations in GitHub Actions workflows or server-side scripts

## Security Notes

- Never commit actual credentials to the repository
- Always use environment variables or GitHub Secrets
- Validate and sanitize all external data
- Use HTTPS for all API connections
- Implement rate limiting for API calls
