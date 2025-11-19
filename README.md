# 🎄 Santa Gift Exchange - Secret Santa App

<p align="center">
  <img src="logo.png" alt="Santa Gift Exchange Logo" width="200"/>
</p>

<p align="center">
  <strong>A modern web application for organizing Secret Santa with wishlists</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#configuration">Configuration</a>
</p>

---

## 📖 What is Santa Gift Exchange?

Santa Gift Exchange is a complete web application that makes it easy to organize Secret Santa for your family, friends, or colleagues. Each participant receives a unique, personal link to fill in their wishlist and see who they've drawn after the lottery.

### ✨ Features

- 🎁 **Wishlists** - Participants can add items with descriptions and links
- 🔐 **Secure access** - Password protection per user
- 👤 **Admin dashboard** - Google OAuth authentication for organizers
- 🎲 **Random drawing** - Fair distribution with one click
- 🔒 **Privacy** - Users only see their own wishlist and the person they drew
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🐳 **Docker ready** - Easy deployment with Docker
- 🌐 **Cloudflare Tunnel** - Secure external access without port forwarding

### 🏗️ Technology Stack

- **Frontend:** Vue.js 3 + TypeScript + Vite
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Authentication:** Google OAuth (admin) + bcrypt (users)
- **Deployment:** Docker + Docker Compose + Cloudflare Tunnel

---

## 🚀 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Google OAuth credentials (for admin)
- (Optional) Cloudflare account for external access

### 1. Download configuration

```bash
# Download docker-compose and .env template
curl -O https://raw.githubusercontent.com/firepeak-technology/santa/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/firepeak-technology/santa/main/.env.example

# Rename .env.example to .env
mv .env.example .env
```

### 2. Configure environment variables

Edit `.env` and fill in:

```bash
nano .env
```

```env
# Database credentials
DB_USER=santa
DB_PASSWORD=choose_a_secure_password_here
DB_NAME=santa

# Frontend URL
FRONTEND_URL=http://localhost
API_URL=http://localhost/api

# Google OAuth (for admin dashboard)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAIL=your-admin@email.com

# JWT Secret (generate a random string)
JWT_SECRET=generate_a_random_string_here

# Cloudflare Tunnel (optional, for external access)
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token
```

### 3. Start the application

```bash
# Pull the latest images
docker compose pull

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 4. Open the application

Go to **http://localhost** in your browser

---

## 🥧 Deployment on Raspberry Pi

### Step 1: Prepare Raspberry Pi

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Test installation
docker --version
docker compose version
```

### Step 2: Project setup

```bash
# Create project directory
mkdir -p ~/santa
cd ~/santa

# Download files
curl -O https://raw.githubusercontent.com/firepeak-technology/santa/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/firepeak-technology/santa/main/.env.example
mv .env.example .env

# Edit configuration
nano .env
```

### Step 3: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - Development: `http://localhost:3001/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to `.env`

### Step 4: (Optional) Setup Cloudflare Tunnel

For external access without port forwarding, you have two options:

#### Option 1: Token-based (Recommended for beginners)

1. **Create tunnel in Cloudflare Dashboard**
   - Go to https://one.dash.cloudflare.com/
   - Navigate to **Zero Trust → Networks → Tunnels**
   - Click **Create a tunnel**
   - Choose **Cloudflared**
   - Give it a name (e.g., `santa`)
   - Click **Save tunnel**

2. **Get your tunnel token**
   - In the installation instructions, scroll to the Docker section
   - Copy the token from the command (everything after `--token`)
   - Add it to your `.env` file as `CLOUDFLARE_TUNNEL_TOKEN`

3. **Configure Public Hostname**
   - Click on the **Public Hostname** tab
   - Click **Add a public hostname**
   - Fill in:
      - **Subdomain:** `santa` (or your choice)
      - **Domain:** Select your domain
      - **Service Type:** `HTTP`
      - **URL:** `frontend:80` (important: use Docker service name, not localhost!)
   - Click **Save hostname**

4. **Update docker-compose.yml**
   ```yaml
   cloudflared:
     image: cloudflare/cloudflared:latest
     container_name: santa-tunnel
     command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
     depends_on:
       - frontend
     networks:
       - santa-network
     restart: unless-stopped
   ```

#### Option 2: Config file-based (Advanced users)

1. **Install cloudflared CLI**
   ```bash
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o cloudflared
   sudo mv cloudflared /usr/local/bin/
   sudo chmod +x /usr/local/bin/cloudflared
   ```

2. **Login and create tunnel**
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create santa
   ```

3. **Create config directory**
   ```bash
   mkdir -p ~/santa/cloudflared
   ```

4. **Copy credentials**
   ```bash
   # Find your tunnel ID
   cloudflared tunnel list
   
   # Copy credentials file
   cp ~/.cloudflared/YOUR-TUNNEL-ID.json ~/santa/cloudflared/credentials.json
   ```

5. **Create config.yml**
   ```bash
   nano ~/santa/cloudflared/config.yml
   ```

   ```yaml
   tunnel: YOUR-TUNNEL-ID
   credentials-file: /etc/cloudflared/credentials.json
   
   ingress:
     - hostname: santa.your-domain.com
       service: http://frontend:80
     - service: http_status:404
   ```

6. **Update docker-compose.yml**
   ```yaml
   cloudflared:
     image: cloudflare/cloudflared:latest
     container_name: cloudflared
     command: tunnel run
     volumes:
       - ./cloudflared:/etc/cloudflared
     networks:
       - santa-network
     restart: unless-stopped
   ```

7. **Route DNS**
   ```bash
   cloudflared tunnel route dns santa santa.your-domain.com
   ```

### Step 5: Start the application

```bash
# Pull images
docker compose pull

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Step 6: Test the application

- **Local:** `http://raspberry-pi-ip`
- **With Cloudflare Tunnel:** `https://santa.your-domain.com`

### Auto-start on reboot

```bash
# Create systemd service
sudo nano /etc/systemd/system/santa.service
```

```ini
[Unit]
Description=Santa Gift Exchange
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/pi/santa
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
User=pi

[Install]
WantedBy=multi-user.target
```

```bash
# Enable service
sudo systemctl enable santa.service
sudo systemctl start santa.service

# Check status
sudo systemctl status santa.service
```

---

## 📋 Using the Application

### For the Organizer (Admin)

1. **Login as admin**
   - Go to the homepage
   - Click "Login as Admin"
   - Login with your Google account (must match `ADMIN_EMAIL`)

2. **Create a group**
   - Go to the Admin Dashboard
   - Enter group name (e.g., "Christmas 2025")
   - Click "Create Group"

3. **Add participants**
   - Enter username
   - Click "Add"
   - Repeat for each participant

4. **Share unique links**
   - Click "📋 Copy Link" for each user
   - Send the link to the respective participant via email/WhatsApp/etc.

5. **Draw names**
   - When everyone is added
   - Click "🎲 Draw Lots"
   - Names are randomly distributed

### For Participants

1. **First visit**
   - Open the received unique link
   - Set a password (minimum 4 characters)
   - You are now logged in

2. **Fill in wishlist**
   - Add items with description and optional link
   - Edit or delete items whenever you want

3. **After the drawing**
   - You see who you drew
   - You can view that person's wishlist
   - No one else can see your wishlist (except the person who drew you)

4. **Next visits**
   - Login with your password
   - Your session remains active during your browser session

---

## 🔧 Configuration

### Environment Variables

| Variable                  | Description                        | Example                                 |
|---------------------------|------------------------------------|-----------------------------------------|
| `DB_USER`                 | PostgreSQL username                | `santa`                                 |
| `DB_PASSWORD`             | PostgreSQL password                | `secure_password_123`                   |
| `DB_NAME`                 | Database name                      | `santa`                                 |
| `FRONTEND_URL`            | Frontend URL (for CORS)            | `http://localhost`                      |
| `API_URL`                 | API URL                            | `http://localhost:3000`                 |
| `GOOGLE_CLIENT_ID`        | Google OAuth Client ID             | `123456-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth Client Secret         | `GOCSPX-xxxxx`                          |
| `ADMIN_EMAIL`             | Email of the admin user            | `admin@example.com`                     |
| `JWT_SECRET`              | Secret for JWT tokens              | `random_string_min_32_chars`            |
| `CLOUDFLARE_TUNNEL_TOKEN` | Cloudflare Tunnel token (optional) | `eyJh...`                               |

### Ports

Default configuration:
- **Frontend:** 80 (HTTP) - can be changed if port 80 is already in use
- **Backend:** Internal (not exposed)
- **Database:** Internal (not exposed)

#### Changing the Frontend Port

If port 80 is already in use on your Raspberry Pi, you can change it:

**docker-compose.yml:**
```yaml
frontend:
  image: ghcr.io/firepeak-technology/santa-frontend:latest
  container_name: santa-frontend
  ports:
    - "8080:80"  # Change 8080 to any available port
  depends_on:
    - backend
  networks:
    - santa-network
  restart: unless-stopped
```

Access:
- **Local:** `http://raspberry-pi-ip:8080`
- **Cloudflare Tunnel:** `https://santa.your-domain.com` (still works, tunnel connects via Docker network)

### Docker Images

The application uses the following images:

```yaml
backend:  ghcr.io/firepeak-technology/santa-backend:latest
frontend: ghcr.io/firepeak-technology/santa-frontend:latest
database: postgres:16-alpine
tunnel:   cloudflare/cloudflared:latest
```

---

## 🔄 Updates

### Update to latest version

```bash
cd ~/santa

# Pull new images
docker compose pull

# Restart services
docker compose up -d

# Cleanup old images
docker image prune -f
```

### Automatic updates (optional)

Create a cron job for automatic updates:

```bash
# Edit crontab
crontab -e

# Add: every day at 3:00 AM
0 3 * * * cd /home/pi/santa && docker compose pull && docker compose up -d && docker image prune -f
```

---

## 🛠️ Troubleshooting

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart services

```bash
# Restart everything
docker compose restart

# Restart specific service
docker compose restart backend
```

### Database backup

```bash
# Create backup
docker compose exec postgres pg_dump -U santa santa > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T postgres psql -U santa santa < backup_20241219.sql
```

### Complete reset

```bash
# Stop and remove everything (including data!)
docker compose down -v

# Start fresh
docker compose up -d
```

### CORS errors

If you get CORS errors:
1. Check `FRONTEND_URL` in `.env`
2. Verify Google OAuth Redirect URI
3. Restart backend: `docker compose restart backend`

### Google OAuth errors

**redirect_uri_mismatch:**
- Ensure Redirect URI in Google Console exactly matches: `http://your-domain.com/api/auth/google/callback`
- For development: `http://localhost:3001/auth/google/callback`
- For production with tunnel: `https://santa.your-domain.com/api/auth/google/callback`

**access_denied:**
- Check if `ADMIN_EMAIL` in `.env` matches the Google account

### Port conflicts

If you get "port already in use" errors:

```bash
# Check what's using port 80
sudo lsof -i :80

# Change frontend port in docker-compose.yml
ports:
  - "8080:80"  # Use 8080 instead of 80

# Or run without exposing ports (Cloudflare Tunnel only)
# Remove the entire "ports:" section from frontend service
```

### Cloudflare Tunnel not working

**Check tunnel status:**
```bash
docker compose logs cloudflared

# Should show: "Registered tunnel connection"
```

**Common issues:**

1. **Token not set or invalid**
   ```bash
   # Check if token is in .env
   grep CLOUDFLARE_TUNNEL_TOKEN .env
   
   # Token should start with: eyJ
   ```

2. **Service URL incorrect in Dashboard**
   - Must be: `frontend:80` (Docker service name)
   - NOT: `localhost:80`
   - NOT: `santa-frontend:80`
   - NOT: `http://frontend:80` (no http:// prefix)

3. **Wrong network configuration**
   - Cloudflared must be in same Docker network as frontend
   - Check docker-compose.yml has `networks: - santa-network` for cloudflared

4. **Config file issues (if using config.yml method)**
   ```bash
   # Check file structure
   ls -la ~/santa/cloudflared/
   # Should show: config.yml and credentials.json
   
   # Check config
   cat ~/santa/cloudflared/config.yml
   
   # Ensure tunnel ID matches your actual tunnel ID
   # Service must be: http://frontend:80 (with port!)
   ```

5. **Test tunnel connectivity**
   ```bash
   # Check if tunnel sees frontend
   docker compose exec cloudflared ping -c 3 frontend
   
   # Check Cloudflare Dashboard
   # Zero Trust → Networks → Tunnels
   # Status should show: HEALTHY (green circle)
   ```

---

## 📊 Monitoring

### Check status

```bash
# Container status
docker compose -f  docker-compose.yml ps

# Resource usage
docker stats

# Disk usage
docker system df
```

### Log rotation

Prevent logs from becoming too large:

```bash
# Edit /etc/docker/daemon.json
sudo nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
# Restart Docker daemon
sudo systemctl restart docker
```

---

## 🔒 Security

### Best Practices

1. **Use strong passwords**
   - `DB_PASSWORD`: minimum 16 characters
   - `JWT_SECRET`: minimum 32 random characters

2. **Update regularly**
   ```bash
   docker compose pull
   docker compose up -d
   ```

3. **Use HTTPS**
   - Cloudflare Tunnel provides automatic HTTPS
   - Or use reverse proxy (nginx/caddy) with Let's Encrypt

4. **Firewall configuration**
   ```bash
   # UFW (Ubuntu/Debian)
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

5. **Backup regularly**
   - Make daily database backups
   - Store `.env` securely

---

## 🤝 Support

### Frequently Asked Questions

**Q: Can I run multiple groups at the same time?**
A: Yes, you can create multiple groups in the admin dashboard.

**Q: Can participants still modify their wishlist after the drawing?**
A: Yes, participants can always add or remove items.

**Q: What happens if someone forgets their password?**
A: As admin, you can create a new user with the same name and share a new link.

**Q: Is the application suitable for large groups?**
A: Yes, there is no limit to the number of participants per group.

**Q: Does every participant need a Google account?**
A: No, only the admin needs Google OAuth. Participants use basic authentication.

### Report an issue

Found a problem? [Open an issue](https://github.com/firepeak-technology/santa/issues) on GitHub.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🎄 Credits

Developed with ❤️ by Firepeak Technology

**Happy Secret Santa! 🎁**

---

<p align="center">
  Made with ☕ and 🎄
</p>
