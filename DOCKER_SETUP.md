# Docker Setup Guide

This guide will help you run the e-commerce application locally using Docker with a complete Supabase stack.

## Prerequisites

- Docker and Docker Compose installed on your machine
- At least 4GB of available RAM
- Ports 3000, 3001, 5432, and 8000 available

## Quick Start

1. **Clone the repository and navigate to the project directory**
   \`\`\`bash
   git clone <your-repo-url>
   cd e-commerce-storefront
   \`\`\`

2. **Start the complete stack**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Wait for all services to be healthy** (this may take 2-3 minutes)
   \`\`\`bash
   docker-compose ps
   \`\`\`

4. **Access the applications**
   - **E-commerce App**: http://localhost:3000
   - **Supabase Studio**: http://localhost:3001 (Database management UI)
   - **Supabase API**: http://localhost:8000

## Services Overview

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | Next.js E-commerce Application |
| studio | 3001 | Supabase Studio (Database UI) |
| db | 5432 | PostgreSQL Database |
| kong | 8000 | API Gateway |
| auth | 9999 | Authentication Service |
| rest | 3000 | REST API Service |
| realtime | 4000 | Realtime Service |

## Database Setup

The database will be automatically initialized with the schema and sample data from the `/scripts` directory:

1. `001_create_ecommerce_schema.sql` - Creates all tables
2. `002_setup_rls_policies.sql` - Sets up Row Level Security
3. `003_seed_sample_data.sql` - Adds sample products and categories
4. `004_create_admin_user.sql` - Creates an admin user

## Admin Access

After the services are running, you can create an admin user by:

1. Sign up for a new account at http://localhost:3000/auth/sign-up
2. Access Supabase Studio at http://localhost:3001
3. Navigate to Authentication > Users
4. Find your user and update the `is_admin` field in the `profiles` table to `true`

## Development Commands

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Rebuild the app after code changes
docker-compose up -d --build app

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
\`\`\`

## Environment Variables

The Docker setup uses predefined environment variables for local development. For production deployment, make sure to:

1. Change all default passwords and secrets
2. Use secure JWT secrets (at least 32 characters)
3. Configure proper CORS settings
4. Set up proper SSL certificates

## Troubleshooting

### Services not starting
- Check if ports 3000, 3001, 5432, 8000 are available
- Ensure Docker has enough memory allocated (4GB recommended)

### Database connection issues
- Wait for the database to be fully initialized (check `docker-compose logs db`)
- Verify the database health check passes: `docker-compose ps`

### Authentication issues
- Ensure the JWT secrets match across all services
- Check that the auth service is running: `docker-compose logs auth`

### App build failures
- Clear Docker cache: `docker system prune -a`
- Rebuild from scratch: `docker-compose build --no-cache app`

## Production Deployment

For production deployment:

1. Update all secrets and passwords in `docker-compose.yml`
2. Configure proper domain names and SSL
3. Set up proper backup strategies for the database
4. Configure monitoring and logging
5. Use Docker secrets or external secret management

## Stopping the Stack

\`\`\`bash
# Stop services but keep data
docker-compose down

# Stop services and remove all data
docker-compose down -v
