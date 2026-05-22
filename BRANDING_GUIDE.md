# Custom Branding Guide

## Overview

The NetBird Dashboard supports runtime branding customization for logo, favicon, page name, and company name. Configuration sources support both web-based URLs and local files, compatible with Docker Compose and Ansible deployments.

## Configuration Variables

- `BRANDING_LOGO_URL`: Logo image URL or local path (default: `/assets/netbird-logo.svg`)
- `BRANDING_ICON_URL`: Favicon URL or local path (default: `/favicon.ico`)
- `BRANDING_PAGE_NAME`: Browser title and page heading (default: `NetBird Dashboard`)
- `BRANDING_COMPANY_NAME`: Company name for branding (default: `NetBird`)

Optional local file mounting:
- `BRANDING_LOGO_PATH`: Local filesystem path to logo file
- `BRANDING_ICON_PATH`: Local filesystem path to icon file

## Docker Compose

### Web-based URLs

```bash
docker-compose up -d \
  -e BRANDING_LOGO_URL="https://cdn.example.com/logo.png" \
  -e BRANDING_ICON_URL="https://cdn.example.com/favicon.ico" \
  -e BRANDING_PAGE_NAME="My Dashboard" \
  -e BRANDING_COMPANY_NAME="My Company"
```

### Local Files

```bash
docker-compose up -d \
  -e BRANDING_LOGO_PATH="/opt/branding/logo.png" \
  -e BRANDING_ICON_PATH="/opt/branding/favicon.ico" \
  -e BRANDING_PAGE_NAME="My Dashboard"
```

### Using .env File

Create `.env`:
```
BRANDING_LOGO_URL=https://cdn.example.com/logo.png
BRANDING_ICON_URL=/assets/custom-icon.ico
BRANDING_PAGE_NAME=My Custom Dashboard
BRANDING_COMPANY_NAME=Acme Corp
```

Run:
```bash
docker-compose up -d
```

## Ansible Deployment

### With Custom Variables

```bash
ansible-playbook -i ansible/inventory.yml ansible/playbook-dashboard.yml \
  -e branding_logo_url="https://cdn.example.com/logo.png" \
  -e branding_page_name="My Custom Dashboard"
```

### With Local Files

```bash
ansible-playbook -i ansible/inventory.yml ansible/playbook-dashboard.yml \
  -e branding_logo_path="/local/path/logo.png" \
  -e branding_icon_path="/local/path/favicon.ico"
```

### Inventory Configuration

Update `ansible/inventory.yml`:
```yaml
dashboard-prod:
  ansible_host: dashboard.example.com
  branding_logo_url: "https://cdn.example.com/logo.png"
  branding_page_name: "My Custom Dashboard"
  branding_company_name: "Acme Corp"
```

## Supported Formats

### Logo & Icon
- Web URLs: `https://cdn.example.com/logo.png`
- Local paths: `/assets/logo.png` or `./assets/logo.png`
- Supported formats: SVG, PNG, JPG, JPEG, GIF, WebP, ICO

### Page Name & Company Name
- Text strings (UTF-8 compatible)
- Max 100 characters recommended

## Integration Points

### React Components

```typescript
import { DynamicLogo } from '@/components/DynamicLogo';
import { getPageName, getCompanyName } from '@/utils/branding';

// Use dynamic logo
<DynamicLogo />

// Use branding values
const title = getPageName();
const company = getCompanyName();
```

### Configuration Loading

Branding config loads from `/config/branding.json` at runtime. Edit this file or set environment variables before container startup.

## Docker Build with Custom Defaults

```dockerfile
FROM netbirdio/dashboard:main

COPY branding.json /usr/share/nginx/html/config/branding.json
COPY logo.png /usr/share/nginx/html/assets/logo.png
COPY favicon.ico /usr/share/nginx/html/favicon.ico
```

## Troubleshooting

- **Logo not loading**: Verify image format and URL accessibility
- **Icon not updating**: Clear browser cache; icon changes apply on page reload
- **Configuration not applied**: Ensure environment variables are set before container startup
- **File not found**: Check volume mount paths in docker-compose.yml

## Best Practices

1. Use CDN-hosted assets for better performance
2. Keep logo dimensions consistent (120x40 for optimal display)
3. Favicon recommended size: 32x32 or 64x64 pixels
4. Test in multiple browsers after changing branding
5. Version your branding assets with timestamps for cache invalidation
