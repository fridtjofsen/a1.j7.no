# A1.j7.no - Autonomous Website

An AI-powered, self-maintaining website built with GitHub Copilot and Google's Jules. This project demonstrates the future of autonomous web development where AI agents collaborate to build, maintain, and grow a website.

## 🌐 Live Site

Visit: [https://a1.j7.no](https://a1.j7.no)

## 🤖 What Makes This Autonomous?

This website is unique because it:
- **Self-maintains**: Automatically updates and improves itself
- **AI-powered**: Built and maintained by GitHub Copilot and Google's Jules
- **Auto-deploys**: Changes are automatically deployed through GitHub Actions
- **Self-healing**: Monitors and fixes issues autonomously

## 🚀 Features

- **GitHub Pages Hosting**: Fast, reliable, and free hosting
- **Automated Deployments**: CI/CD pipeline via GitHub Actions
- **Scheduled Updates**: Daily autonomous content updates
- **Database Integration**: Connected to MySQL for dynamic data
- **Email Integration**: Automated communications via a1@j7.no
- **Social Media**: Integrated with Bluesky for social engagement
- **Responsive Design**: Mobile-first, modern UI

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **AI Tools**: GitHub Copilot, Google's Jules
- **Database**: MySQL
- **Email**: a1@j7.no
- **Social**: Bluesky

## 📋 Setup Instructions

### Domain Configuration

Point your domain `a1.j7.no` to GitHub Pages:
1. Add DNS A records pointing to GitHub Pages IPs:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
2. Add a CNAME record: `www.a1.j7.no` → `fridtjofsen.github.io`

### GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: Select your deployment branch
4. The CNAME file in the repository will configure the custom domain

### Required Secrets

The following secrets need to be configured in GitHub repository settings (ask @fridtjofsen):

- `MYSQL_HOST`: MySQL database host
- `MYSQL_DATABASE`: Database name
- `MYSQL_USER`: Database user
- `MYSQL_PASSWORD`: Database password
- `EMAIL_API_KEY`: Email service API key
- `BLUESKY_HANDLE`: Bluesky account handle
- `BLUESKY_APP_PASSWORD`: Bluesky app password
- `PAT_TOKEN`: GitHub Personal Access Token (for advanced operations)

## 🔄 Autonomous Workflows

### Deployment Workflow
- **Trigger**: Push to main or deployment branch
- **Action**: Automatically builds and deploys to GitHub Pages
- **File**: `.github/workflows/deploy.yml`

### Autonomous Update Workflow
- **Trigger**: Daily at 9 AM UTC (or manual)
- **Action**: Checks for updates, creates content, commits changes
- **File**: `.github/workflows/autonomous-update.yml`

## 📁 Project Structure

```
a1.j7.no/
├── index.html              # Main website file
├── styles.css              # Styling
├── script.js               # JavaScript functionality
├── config.json             # Configuration file
├── CNAME                   # Custom domain configuration
├── README.md               # This file
├── LICENSE                 # MIT License
└── .github/
    └── workflows/
        ├── deploy.yml              # Deployment workflow
        └── autonomous-update.yml   # Autonomous update workflow
```

## 🔐 Security

- All secrets are stored in GitHub Secrets
- No sensitive data in repository
- HTTPS enforced via GitHub Pages
- Regular automated security updates

## 📧 Contact

- **Email**: a1@j7.no
- **Website**: https://a1.j7.no
- **GitHub**: https://github.com/fridtjofsen/a1.j7.no

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

Built with:
- GitHub Copilot for AI-assisted development
- Google's Jules for intelligent automation
- GitHub Pages for hosting
- The open-source community

---

*This is an experimental project exploring the possibilities of autonomous web development with AI.*