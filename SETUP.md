# Setup Guide for A1.j7.no

This guide provides step-by-step instructions for setting up the autonomous website.

## Prerequisites

- GitHub repository access
- Domain control for a1.j7.no
- Access to MySQL database
- Email service credentials
- Bluesky account credentials

## Step 1: GitHub Repository Configuration

### Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under "Source", select:
   - Source: **Deploy from a branch**
   - Branch: Select the branch you want to deploy (e.g., `main` or `copilot/setup-autonomous-website`)
   - Folder: **/ (root)**
4. Click **Save**

### Configure Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** and add the following secrets:

```
MYSQL_HOST          # Your MySQL server hostname
MYSQL_DATABASE      # Database name
MYSQL_USER          # Database username
MYSQL_PASSWORD      # Database password
EMAIL_API_KEY       # Email service API key (e.g., SendGrid, Mailgun)
BLUESKY_HANDLE      # Your Bluesky handle (e.g., a1.j7.no)
BLUESKY_APP_PASSWORD # Bluesky app-specific password
PAT_TOKEN           # GitHub Personal Access Token with repo and workflow permissions
```

### Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions", select:
   - **Allow all actions and reusable workflows**
3. Under "Workflow permissions", select:
   - **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

## Step 2: Domain Configuration

### DNS Settings for a1.j7.no

Configure the following DNS records with your domain registrar:

#### A Records
Point your apex domain to GitHub Pages:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

#### CNAME Record (Optional for www subdomain)
```
Type: CNAME
Name: www
Value: fridtjofsen.github.io
```

**Note**: DNS propagation can take up to 24-48 hours, but usually completes within a few hours.

### Verify Custom Domain in GitHub

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter: `a1.j7.no`
3. Click **Save**
4. Wait for DNS check to complete (green checkmark)
5. Check **Enforce HTTPS** once DNS is verified

## Step 3: Database Setup

### MySQL Database Configuration

1. Ensure your MySQL database is accessible from GitHub Actions runners
2. Create necessary tables for autonomous content:

```sql
CREATE DATABASE IF NOT EXISTS a1j7no;

USE a1j7no;

CREATE TABLE IF NOT EXISTS content_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content_type VARCHAR(50),
    content TEXT,
    status VARCHAR(20),
    created_by VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS site_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50),
    event_data JSON,
    user_agent TEXT
);
```

## Step 4: Email Configuration

### Email Service Setup

1. Choose an email service provider (e.g., SendGrid, Mailgun, AWS SES)
2. Configure the service for domain a1@j7.no
3. Verify your domain with the email provider
4. Add SPF, DKIM, and DMARC records to your DNS:

```
TXT record for SPF:
v=spf1 include:_spf.example.com ~all

TXT record for DKIM:
[Provided by your email service]

TXT record for DMARC:
v=DMARC1; p=none; rua=mailto:dmarc@a1.j7.no
```

## Step 5: Bluesky Integration

### Bluesky Account Setup

1. Create or use existing Bluesky account
2. Set handle to match domain: `a1.j7.no`
3. Generate an app-specific password:
   - Go to Settings → Privacy and Security → App Passwords
   - Create new app password
   - Save the password as `BLUESKY_APP_PASSWORD` secret

### Verify Domain on Bluesky

1. In Bluesky settings, verify your domain handle
2. Add TXT record to DNS:
```
Type: TXT
Name: _atproto
Value: [Provided by Bluesky]
```

## Step 6: Testing the Setup

### Test GitHub Actions Workflows

1. Go to **Actions** tab in your repository
2. You should see two workflows:
   - "Deploy to GitHub Pages"
   - "Autonomous Content Update"

### Trigger Manual Deployment

1. Click on "Deploy to GitHub Pages" workflow
2. Click **Run workflow**
3. Select your branch
4. Click **Run workflow**
5. Wait for the workflow to complete
6. Check the deployment URL

### Verify Website

1. Wait for deployment to complete (usually 1-2 minutes)
2. Visit `https://a1.j7.no` (or your GitHub Pages URL)
3. Verify all sections load correctly
4. Check browser console for errors

## Step 7: Enable Autonomous Features

### Schedule Autonomous Updates

The autonomous update workflow is already configured to run daily at 9 AM UTC. You can also trigger it manually:

1. Go to **Actions** → **Autonomous Content Update**
2. Click **Run workflow**
3. Watch the autonomous system work!

### Monitor Autonomous Operations

- Check the **Actions** tab for workflow runs
- Review commit history for autonomous updates
- Monitor the `.last-update` file for update timestamps

## Troubleshooting

### GitHub Pages not deploying

- Verify the deploy workflow completed successfully
- Check that GitHub Pages is enabled in repository settings
- Ensure the branch is correct in Pages settings

### Custom domain not working

- Verify DNS records are correct (use `dig a1.j7.no` or online DNS checker)
- Wait for DNS propagation (up to 48 hours)
- Check DNS verification status in GitHub Pages settings

### Workflows failing

- Check workflow logs in the Actions tab
- Verify all secrets are configured correctly
- Ensure workflow permissions are set correctly

### HTTPS not working

- DNS must be verified first
- HTTPS enforcement can take a few minutes after DNS verification
- GitHub automatically provisions SSL certificate

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use environment variables** for all sensitive data
3. **Regularly rotate** API keys and passwords
4. **Monitor** the Actions logs for suspicious activity
5. **Enable branch protection** for main/production branches
6. **Review** pull requests from automated systems

## Maintenance

### Regular Tasks

- Monitor workflow runs weekly
- Review autonomous updates for quality
- Update dependencies monthly
- Check analytics and performance
- Rotate secrets quarterly

### Updating the Site

Manual updates can be made by:
1. Editing files directly on GitHub or locally
2. Committing changes
3. Pushing to the deployment branch
4. Automatic deployment will trigger

## Support

For issues or questions:
- Check repository Issues
- Review workflow logs
- Contact: a1@j7.no
- Repository: https://github.com/fridtjofsen/a1.j7.no

---

**Last Updated**: 2026-01-26
