# BMAD Test Repository 003

## Overview
This is the BMAD (Business Model Architecture Design) SDLC application repository - a comprehensive platform for managing software development lifecycle processes. The application integrates AI-powered tools with traditional SDLC methodologies to streamline project delivery.

## Description
SDLC App Repository - A full-stack enterprise application designed to streamline and automate software development lifecycle workflows, from ideation to deployment. This platform combines project management, AI assistance, document generation, and team collaboration in a unified solution.

## Key Features

### 📋 Project Management
- Complete project lifecycle tracking
- Epic and story management
- Real-time project status dashboards
- Resource allocation and planning
- Milestone tracking and reporting

### 🔄 SDLC Phase Management
- **Configuration Phase**: Project setup and initialization
- **Ideation Phase**: Requirements gathering and brainstorming
- **Product Definition**: Detailed specifications and architecture
- **Planning Phase**: Sprint planning and task breakdown
- **Development Phase**: Code implementation and testing
- **Deployment**: Release management and monitoring

### 🤖 AI Integration
- GitHub MCP (Model Context Protocol) server integration
- Automated document generation
- Intelligent code analysis and suggestions
- Context-aware assistance throughout development

### 👥 Collaboration Tools
- Team workspace management
- Real-time updates and notifications
- Role-based access control
- SharePoint integration for document management

### 🔐 Security & Authentication
- Microsoft Authentication Library (MSAL) integration
- Azure AD support
- Secure API endpoints
- Role-based permissions

## Technology Stack

### Frontend
- **Framework**: TypeScript/React
- **UI Library**: Modern component library
- **State Management**: Context API / Redux
- **Build Tool**: Vite / Webpack

### Backend
- **Runtime**: Node.js
- **Framework**: Fastify (high-performance web framework)
- **Language**: TypeScript
- **API Design**: RESTful architecture

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Migration**: Prisma Migrate
- **Schema Management**: Version-controlled migrations

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Azure / AWS ready
- **Monitoring**: Application Insights / Telemetry

### Development Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm / pnpm
- **Testing**: Jest, Vitest
- **Linting**: ESLint, Prettier
- **Type Checking**: TypeScript strict mode

## Project Structure
```
bmad-test-repo-003/
├── .github/                    # GitHub workflows and configurations
├── .bmad-core/                 # Core BMAD framework files
├── src/
│   ├── backend/               # Backend API services
│   │   ├── src/
│   │   │   ├── app.ts        # Fastify application setup
│   │   │   ├── server.ts     # Server entry point
│   │   │   ├── plugins/      # Fastify plugins
│   │   │   ├── routes/       # API route handlers
│   │   │   └── services/     # Business logic services
│   │   ├── prisma/           # Database schema and migrations
│   │   ├── tests/            # Backend tests
│   │   └── package.json
│   ├── frontend/              # Frontend React application
│   └── shared/                # Shared types and utilities
│       ├── types/            # TypeScript type definitions
│       ├── constants/        # Shared constants
│       └── utils/            # Utility functions
├── docs/                      # Comprehensive documentation
│   ├── architecture.md       # System architecture
│   ├── prd.md               # Product Requirements Document
│   ├── poc-brief.md         # Proof of Concept brief
│   └── stories/             # User stories and epics
├── scripts/                   # Database and utility scripts
│   └── init-db.sql          # Database initialization
├── SDLC-DEMO-HTML/           # Demo HTML pages and prototypes
├── complete-database-schema.sql  # Full database schema
├── database-erd-dbdiagram.dbml  # ERD diagram source
├── LOCAL_SETUP_GUIDE.md      # Setup instructions
└── package.json              # Root workspace configuration
```

## Getting Started

### Prerequisites
- Node.js v18+ or v20+
- PostgreSQL 14+
- Docker & Docker Compose (optional)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ig-Saad/bmad-test-repo-003.git
   cd bmad-test-repo-003
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

For detailed setup instructions, refer to [`LOCAL_SETUP_GUIDE.md`](./LOCAL_SETUP_GUIDE.md)

## Documentation

- **[Architecture Overview](./docs/architecture.md)** - System design and architecture
- **[Product Requirements](./docs/prd.md)** - Detailed product specifications
- **[POC Brief](./docs/poc-brief.md)** - Proof of concept documentation
- **[Database ERD](./ERD-README.md)** - Database schema and relationships
- **[User Stories](./docs/stories/)** - Epic and story breakdowns
- **[POC Architecture](./POC_ARCHITECTURE_DEPLOYMENT_STRATEGY.md)** - Deployment strategy

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Code Quality
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- Pre-commit hooks with Husky
- Comprehensive test coverage

## Contributing
Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Repository Information
- **Owner**: Ig-Saad
- **Created**: December 5, 2025
- **Status**: Active Development
- **Latest Release**: v0.1.0 (POC)

## Support & Contact
For questions or support, please open an issue in the repository.

## License
MIT License - see LICENSE file for details

---

**Built with ❤️ using modern web technologies and AI-powered tools**
