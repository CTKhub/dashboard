# Runtime Branding Implementation Summary

**Project:** CTKhub/dashboard (NetBird Management Service Web UI Panel)  
**Repository:** https://github.com/CTKhub/dashboard  
**Branch:** `feature/runtime-branding`  
**Date:** 2026-05-22  
**Language:** TypeScript (99%), React 19, Next.js 16

---

## Overview

Implemented complete runtime branding system enabling customization of logo, favicon, page name, and company name via environment variables. Configuration supports both web-based URLs and local file mounting. Fully compatible with Docker Compose and Ansible deployments.

---

## Implementation Details

### 1. Core Branding Utilities

**File:** `src/utils/branding.ts`
- Default branding configuration with fallbacks
- URL validation for web and local paths
- Exported functions:
  - `getBrandingConfig()` - Get full config object
  - `getLogoUrl()` - Get validated logo URL
  - `getIconUrl()` - Get validated icon URL
  - `getPageName()` - Get page title
  - `getCompanyName()` - Get company name

### 2. React Components

**Files:**
- `src/components/DynamicLogo.tsx` - Image-based logo component with error fallback
- `src/components/DynamicIcon.tsx` - Dynamic favicon injector

**Features:**
- Automatic format detection (SVG, PNG, JPG, GIF, WebP)
- Error handling with fallback to default assets
- Client-side rendering with useEffect hooks

### 3. Metadata Utilities

**File:** `src/utils/meta-dynamic.ts`
- `getDynamicMetaTitle()` - Browser title from branding config
- `getDynamicMetaDescription()` - Dynamic meta description

### 4. Runtime Configuration Loading

**File:** `public/branding-config-loader.js`
- IIFE (Immediately Invoked Function Expression)
- Loads `/config/branding.json` at page load
- Updates favicon dynamically
- Sets document title at runtime
- Graceful error handling with console warnings

### 5. Default Configuration

**File:** `public/config/branding.json`
```json
{
  "logoUrl": "/assets/netbird-logo.svg",
  "iconUrl": "/favicon.ico",
  "pageName": "NetBird Dashboard",
  "companyName": "NetBird"
}
```

---

## Docker Integration

### Docker Script

**File:** `docker/init_branding.sh`
- Bash script for container initialization
- Handles environment variable substitution
- Supports:
  - Web URLs: `https://cdn.example.com/logo.png`
  - Local files: Copies to `/usr/share/nginx/html/assets/`
  - Automatic favicon handling
- Generates `branding.json` at runtime

### Updated Dockerfile

**File:** `docker/Dockerfile` (updated)
- Added `init_branding.sh` copy and execution
- Created `/config` and `/assets` directories
- Executes branding script before nginx startup

### Updated Supervisor Config

**File:** `docker/supervisord.conf` (updated)
- Added `[program:init_branding]` section
- Priority: 202 (after init_react_envs)
- Autostart: true, Autorestart: false

---

## Docker Compose

**File:** `docker-compose.yml`

**Services:**
- Dashboard container with full configuration
- Volumes for branding files
- Letsencrypt certificate persistence
- Health checks (30s interval, 3 retries)
- Custom network bridge: `netbird`

**Environment Variables:**
```env
# Auth (required)
AUTH_AUTHORITY, AUTH_CLIENT_ID, AUTH_AUDIENCE, NETBIRD_MGMT_API_ENDPOINT

# Branding (optional with defaults)
BRANDING_LOGO_URL=/assets/netbird-logo.svg
BRANDING_ICON_URL=/favicon.ico
BRANDING_PAGE_NAME=NetBird Dashboard
BRANDING_COMPANY_NAME=NetBird

# Local files (optional)
BRANDING_LOGO_PATH=
BRANDING_ICON_PATH=

# SSL/Let's Encrypt
LETSENCRYPT_DOMAIN, LETSENCRYPT_EMAIL, NGINX_SSL_PORT=443
```

**Volume Mounts:**
- Branding files (read-only)
- Certificates (persistent)

---

## Ansible Automation

### Playbook

**File:** `ansible/playbook-dashboard.yml`

**Tasks:**
1. Install Docker and Docker Compose
2. Create deployment directory
3. Copy custom branding files (optional)
4. Generate docker-compose.yml from template
5. Deploy with Docker Compose
6. Wait for service readiness (30s timeout, 10s delays)
7. Display deployment status

**Variables:**
- `dashboard_dir` - Default: `/opt/netbird-dashboard`
- `branding_logo_url` - Default: `/assets/netbird-logo.svg`
- `branding_icon_url` - Default: `/favicon.ico`
- `branding_page_name` - Default: `NetBird Dashboard`
- `branding_company_name` - Default: `NetBird`

### Jinja2 Template

**File:** `ansible/templates/docker-compose.yml.j2`
- Dynamic docker-compose generation
- Variable interpolation for environment config
- Volume mounting for custom assets

### Inventory Example

**File:** `ansible/inventory.yml`

**Sample Host:**
```yaml
dashboard-prod:
  ansible_host: dashboard.example.com
  ansible_user: ubuntu
  auth_authority: "https://auth.example.com"
  auth_client_id: "your-client-id"
  auth_audience: "your-audience"
  netbird_mgmt_api_endpoint: "https://api.netbird.io"
  branding_logo_url: "https://cdn.example.com/logo.png"
  branding_icon_url: "https://cdn.example.com/favicon.ico"
  branding_page_name: "My Custom Dashboard"
  branding_company_name: "My Company"
  letsencrypt_domain: "dashboard.example.com"
  letsencrypt_email: "admin@example.com"
```

---

## Configuration Files

### Environment Template

**File:** `.env.example`
- Template for environment variables
- Includes auth, branding, and SSL configuration
- Ready for Docker Compose usage

---

## Documentation

**File:** `BRANDING_GUIDE.md`

**Contents:**
1. Overview and configuration variables
2. Docker Compose usage (web URLs, local files, .env file)
3. Ansible deployment (custom variables, local files, inventory)
4. Supported formats (SVG, PNG, JPG, GIF, WebP, ICO)
5. React component integration examples
6. Docker build examples
7. Troubleshooting guide
8. Best practices

---

## File Structure

```
CTKhub/dashboard/
├── src/
│   ├── components/
│   │   ├── DynamicLogo.tsx
│   │   └── DynamicIcon.tsx
│   ├── utils/
│   │   ├── branding.ts
│   │   └── meta-dynamic.ts
├── public/
│   ├── branding-config-loader.js
│   └── config/
│       └── branding.json
├── docker/
│   ├── Dockerfile (updated)
│   ├── init_branding.sh
│   ├── supervisord.conf (updated)
│   ├── init_react_envs.sh
│   └── ...
├── ansible/
│   ├── playbook-dashboard.yml
│   ├── inventory.yml
│   └── templates/
│       └── docker-compose.yml.j2
├── docker-compose.yml
├── .env.example
├── BRANDING_GUIDE.md
└── ...
```

---

## Deployment Methods

### 1. Docker Compose (Web URLs)
```bash
docker-compose up -d \
  -e BRANDING_LOGO_URL="https://cdn.example.com/logo.png" \
  -e BRANDING_PAGE_NAME="My Dashboard"
```

### 2. Docker Compose (.env file)
```bash
# Create .env with variables
docker-compose up -d
```

### 3. Docker Compose (Local Files)
```bash
docker-compose up -d \
  -e BRANDING_LOGO_PATH="/opt/branding/logo.png" \
  -e BRANDING_ICON_PATH="/opt/branding/favicon.ico"
```

### 4. Ansible Playbook
```bash
ansible-playbook -i ansible/inventory.yml ansible/playbook-dashboard.yml \
  -e branding_logo_url="https://cdn.example.com/logo.png"
```

---

## Key Features

✅ **Runtime Configuration** - No rebuild required for branding changes  
✅ **Multiple Sources** - Web URLs, local files, defaults  
✅ **Docker Ready** - Full Docker Compose integration  
✅ **Ansible Compatible** - Complete IaC automation  
✅ **Fallback Defaults** - Graceful degradation with defaults  
✅ **Error Handling** - Comprehensive error handling and validation  
✅ **Security** - Read-only volume mounts for branding files  
✅ **Health Checks** - Container health monitoring  
✅ **SSL Support** - Let's Encrypt integration  
✅ **Documentation** - Comprehensive branding guide included  

---

## Environment Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `BRANDING_LOGO_URL` | URL/Path | `/assets/netbird-logo.svg` | Logo image URL or local path |
| `BRANDING_ICON_URL` | URL/Path | `/favicon.ico` | Favicon URL or local path |
| `BRANDING_PAGE_NAME` | String | `NetBird Dashboard` | Browser title |
| `BRANDING_COMPANY_NAME` | String | `NetBird` | Company name |
| `BRANDING_LOGO_PATH` | Path | - | Local file path for logo |
| `BRANDING_ICON_PATH` | Path | - | Local file path for icon |

---

## Git Commits

Branch: `feature/runtime-branding`

| Commit | Message |
|--------|---------|
| `13e00306e8` | feat: add runtime branding configuration utilities |
| `393bdaeac8` | feat: add dynamic logo component for branding |
| `aaa3424d61` | feat: add dynamic icon component for branding |
| `2080df6c5b` | feat: add dynamic metadata utilities for branding |
| `dd02daf30e` | feat: add runtime branding config loader script |
| `39236e2daa` | feat: add Ansible inventory example with branding variables |
| `db34b9cc0a` | docs: add comprehensive branding customization guide |

---

## Build & Run

### Prerequisites
- Node.js 20.9.0+
- Docker & Docker Compose
- Ansible (optional, for automated deployment)

### Build Steps
```bash
# 1. Build Next.js
npm install
npm run build

# 2. Build Docker image
docker build -f docker/Dockerfile -t dashboard-branding:latest .

# 3. Run with Docker Compose
docker-compose up -d
```

### Quick Start
```bash
cp .env.example .env
# Edit .env with your configuration
docker-compose up -d
```

---

## Testing Branding

### Verify Configuration Loading
```bash
# Check config file in running container
docker exec <container-id> cat /usr/share/nginx/html/config/branding.json

# View logs
docker-compose logs dashboard
```

### Test URL Changes
```bash
docker exec <container-id> curl http://localhost/config/branding.json
```

---

## Future Enhancements

- [ ] Theme color customization (CSS variables)
- [ ] Multiple logo sizes for responsive design
- [ ] Branding API endpoint for runtime updates
- [ ] Branding preview UI in admin panel
- [ ] S3-compatible storage support for assets
- [ ] CDN integration for asset delivery

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Logo not loading | Verify URL accessibility, check image format |
| Favicon not updating | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Config not applied | Ensure env vars set before container start |
| Volume mount errors | Check path permissions and docker-compose syntax |
| Container won't start | Check logs: `docker-compose logs dashboard` |

---

## References

- **Repository:** https://github.com/CTKhub/dashboard
- **Branch:** https://github.com/CTKhub/dashboard/tree/feature/runtime-branding
- **Documentation:** See `BRANDING_GUIDE.md` in repository
- **Docker Docs:** https://docs.docker.com/
- **Ansible Docs:** https://docs.ansible.com/
- **Next.js Docs:** https://nextjs.org/docs

---

## Contact & Support

For issues or questions regarding the branding implementation:
1. Check `BRANDING_GUIDE.md` for common scenarios
2. Review `docker-compose.yml` for configuration examples
3. Check container logs: `docker-compose logs dashboard`
4. Refer to GitHub issues in CTKhub/dashboard repository
