# JobsAbroad - Project Documentation

## 📋 Project Overview

**JobsAbroad** (also known as **Nova Educational Consultancy** / **Addis Temari**) is a comprehensive web platform designed to help students and professionals find international job opportunities, university programs, scholarships, and educational resources. The platform provides a complete ecosystem for users planning to work or study abroad, particularly focusing on European countries like Germany, Canada, and Australia.

### Website Purpose
The platform serves as a bridge between aspiring international students/workers and opportunities abroad, offering:
- University program discovery and application management
- Job opportunities and career guidance
- Scholarship information and application support
- Content creator ecosystem for sharing opportunities
- Gamification features to engage users
- Multi-language support (English and Amharic)

### Production URL
- **Backend API**: `https://jobsabroad.onrender.com`
- **Frontend**: Deployed separately (likely on Render or similar platform)

---

## 📁 Folder Structure

```
jobsabroad/
├── backend/                    # Django REST API backend
│   ├── university_api/         # Main Django project settings
│   ├── universities/           # University management app
│   ├── profiles/               # User profiles and applications
│   ├── payments/               # Payment processing (Chapa integration)
│   ├── content_creator/        # Content creator platform
│   ├── gamification/           # Points, achievements, leaderboards
│   ├── notifications/          # User notification system
│   ├── contacts/               # Contact form submissions
│   ├── emails/                 # Email management
│   ├── opportunities/          # Job/scholarship opportunities
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Container configuration
│   ├── docker-compose.yml      # Local development setup
│   └── db.sqlite3              # Local SQLite database
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── Layout.tsx      # Main layout wrapper
│   │   │   ├── Navigation.tsx  # Navigation bar
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── apply/          # Application forms
│   │   │   ├── dashboard/      # User dashboard
│   │   │   └── payment/        # Payment processing
│   │   ├── services/           # API services
│   │   │   ├── api.ts          # API client
│   │   │   └── auth.ts         # Auth utilities
│   │   ├── content/            # Content management
│   │   │   ├── websiteContent.ts  # i18n content
│   │   │   └── LanguageContext.tsx
│   │   ├── lib/                # Utilities
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Node dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── tsconfig.json           # TypeScript config
│
├── node_modules/               # Root node modules
├── venv/                      # Python virtual environment
└── package.json               # Root package.json
```

---

## 🎨 Frontend Architecture

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router DOM 7.9.5
- **UI Library**: 
  - Radix UI components (Select, Tabs, Progress, Label, etc.)
  - Tailwind CSS 4.1.17
  - shadcn/ui components
  - Lucide React icons
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API

### Key Features

#### 1. **Multi-Language Support (i18n)**
- Supports English (`en`) and Amharic (`am`)
- Centralized content management in `websiteContent.ts`
- Language switcher component
- Context-based language provider

#### 2. **Authentication System**
- JWT-based authentication
- Login/Registration pages
- Protected routes with auth guards
- Token storage in localStorage

#### 3. **Application Module**
- Multi-step application form (`MultiStepForm.tsx`)
- Form validation
- Progress tracking
- Step-by-step wizard interface

#### 4. **Dashboard**
- User dashboard with application tracking
- University favorites
- Application status management
- Subscription status display

#### 5. **Payment Integration**
- Payment processing page
- Payment success/failure handling
- Integration with Chapa payment gateway

#### 6. **UI Components**
- Modern, responsive design with Tailwind CSS
- Reusable component library (shadcn/ui)
- Card, Button, Input, Select, Tabs, Progress components
- Alert and Badge components

### Frontend API Integration
- Base URL: `https://jobsabroad.onrender.com/api`
- JWT token authentication
- RESTful API endpoints
- Error handling and response parsing

---

## ⚙️ Backend Architecture

### Technology Stack
- **Framework**: Django 5.2.5
- **API**: Django REST Framework 3.15.2
- **Authentication**: JWT (djangorestframework-simplejwt 5.4.0)
- **Database**: 
  - PostgreSQL (production)
  - SQLite (local development)
- **Task Queue**: Celery 5.3.6 with Redis
- **Caching**: Redis 5.2.1
- **Web Server**: Gunicorn 23.0.0
- **Static Files**: WhiteNoise 6.9.0

### Django Apps

#### 1. **universities** (Core App)
**Purpose**: University and program management

**Models**:
- `University`: Stores university information (name, country, city, fees, programs, scholarships, intakes)
- `UserDashboard`: User's application tracking (favorites, planning, applied, accepted, visa_approved)
- `ApplicationDraft`: Temporary storage for application data before payment
- `CountryJobSite`: Job site links per country
- `ScholarshipResult`: Cached scholarship data from external APIs
- `UniversityJSONImport`: Admin tool for bulk importing universities

**Features**:
- University scraping and data extraction
- Scholarship integration (ScholarshipOwl API)
- Application status tracking
- User dashboard management
- Popular countries analytics

#### 2. **profiles**
**Purpose**: User profile and job preferences

**Models**:
- `Profile`: Extended user profile (bio, phone, DOB, skills, country, experience)
- `WorkExperience`: User's work history
- `JobPreference`: Job preferences (start date, work permit, salary)

**Features**:
- Profile creation on user registration
- Work experience tracking
- Job preference management
- Email notifications on registration

#### 3. **payments**
**Purpose**: Payment processing and subscription management

**Models**:
- `Payment`: Payment records (amount, tx_ref, status, chapa_reference)

**Features**:
- Chapa payment gateway integration
- Payment webhook handling
- Subscription activation
- Payment verification

#### 4. **content_creator**
**Purpose**: Content creator platform for sharing opportunities

**Models**:
- `CreatorApplication`: Creator application submissions
- `OpportunityPost`: Posts by creators (scholarships, internships, jobs, guides)
- `CreatorRevenue`: Revenue tracking for creators
- `ApplicationSettings`: Creator application settings

**Features**:
- Creator application system
- Premium content support
- Revenue sharing (35% to creators)
- Draft/publish workflow
- Multiple content types (scholarship, internship, job, tutorial, guide, success story, insight)

#### 5. **gamification**
**Purpose**: User engagement through points and achievements

**Models**:
- `Achievement`: Achievement definitions (categories, points, icons)
- `UserAchievement`: User's earned achievements
- `UserProfile`: Game profile (points, level, streak)
- `Leaderboard`: Weekly/monthly/all-time rankings

**Features**:
- Points system (100 points per level)
- Achievement categories (profile, university, application, social, milestone)
- Activity streaks
- Leaderboard rankings

#### 6. **notifications**
**Purpose**: User notification system

**Models**:
- `Notification`: System notifications (title, message, audience, expiration)
- `NotificationRead`: Read status tracking

**Features**:
- Broadcast to all users or custom audiences
- Expiration dates
- Read/unread tracking
- Active/inactive status

#### 7. **contacts**
**Purpose**: Contact form submissions

**Models**:
- `Contact`: Contact messages (name, email, subject, message)

**Features**:
- Contact form API
- Message storage and retrieval

#### 8. **emails**
**Purpose**: Email management and templates

**Features**:
- Email configuration (Gmail SMTP)
- Welcome emails
- Payment completion emails
- Application status updates

### API Endpoints

#### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - JWT token obtain
- `POST /api/token/refresh/` - Token refresh

#### Universities
- `GET /api/universities/` - List universities (with filtering)
- `GET /api/universities/{id}/` - University details
- `GET /api/popular-countries/` - Popular countries list
- `GET /api/job-sites/` - Job sites by country

#### User Dashboard
- `GET /api/dashboard/` - User dashboard data
- `POST /api/dashboard/favorite/` - Add/remove favorites
- `POST /api/dashboard/planning/` - Add to planning
- `POST /api/dashboard/applied/` - Mark as applied
- `POST /api/dashboard/accepted/` - Mark as accepted
- `POST /api/dashboard/visa-approved/` - Mark visa approved

#### Applications
- `POST /api/submit-application/` - Submit application draft
- `POST /api/chapa-webhook/` - Payment webhook

#### Payments
- `POST /api/initialize-payment/` - Initialize payment
- `POST /api/payments/confirm/` - Confirm payment

#### Content Creator
- `GET /api/creator/posts/` - List opportunity posts
- `POST /api/creator/apply/` - Apply as creator
- `GET /api/creator/settings/` - Creator settings

#### Gamification
- `GET /api/gamification/profile/` - User game profile
- `GET /api/gamification/achievements/` - User achievements
- `GET /api/gamification/leaderboard/` - Leaderboard

#### Notifications
- `GET /api/notifications/` - User notifications
- `POST /api/notifications/{id}/read/` - Mark as read

### Background Tasks (Celery)
- Subscription expiration checks (daily)
- Email sending
- Application status update emails
- Scholarship data fetching

---

## 🔑 Key Features

### 1. **University Discovery & Management**
- Comprehensive university database
- Filter by country, program type, fees
- Program details (Bachelor's, Master's)
- Intake periods and deadlines
- Scholarship information
- Application fee and tuition tracking

### 2. **Application Tracking**
- Multi-stage application workflow:
  - Planning to Apply
  - Applied
  - Accepted
  - Visa Approved
- Favorites system
- Application drafts
- Status updates via email

### 3. **Payment & Subscription**
- Chapa payment gateway integration
- Subscription-based access (600 ETB/month)
- Payment verification
- Subscription status tracking
- Automatic expiration handling

### 4. **Content Creator Platform**
- Creator application system
- Opportunity posting (scholarships, jobs, internships)
- Premium content sections
- Revenue sharing (35% to creators)
- Draft/publish workflow
- Multiple content types

### 5. **Gamification**
- Points and levels system
- Achievement badges
- Activity streaks
- Leaderboards (weekly, monthly, all-time)
- Engagement rewards

### 6. **Notifications**
- System-wide announcements
- Targeted notifications
- Expiration dates
- Read/unread tracking

### 7. **Multi-Language Support**
- English and Amharic
- Dynamic content switching
- Localized UI elements

### 8. **Job Opportunities**
- Country-specific job sites
- Job site database
- Integration with external job boards

### 9. **Scholarship Integration**
- ScholarshipOwl API integration
- Cached scholarship results
- Country-based filtering

### 10. **Email System**
- Welcome emails on registration
- Payment completion emails
- Application status updates
- Gmail SMTP configuration

---

## 🗄️ Database Schema

### Core Models Relationships
```
User (Django Auth)
├── Profile (OneToOne)
│   ├── WorkExperience (ForeignKey)
│   └── JobPreference (OneToOne)
├── UserDashboard (OneToOne)
│   ├── favorites (ManyToMany → University)
│   ├── planning_to_apply (ManyToMany → University)
│   ├── applied (ManyToMany → University)
│   ├── accepted (ManyToMany → University)
│   └── visa_approved (ManyToMany → University)
├── Payment (ForeignKey)
├── CreatorApplication (OneToOne)
├── OpportunityPost (ForeignKey - as creator)
├── UserAchievement (ForeignKey)
├── UserProfile (OneToOne - gamification)
└── Notification (ManyToMany - as recipient)

University
├── favorited_by (ManyToMany → UserDashboard)
├── planned_by (ManyToMany → UserDashboard)
├── applied_by (ManyToMany → UserDashboard)
├── accepted_by (ManyToMany → UserDashboard)
└── visa_approved_for (ManyToMany → UserDashboard)
```

---

## 🚀 Deployment

### Backend Deployment (Render)
- **Platform**: Render.com
- **Runtime**: Python 3.12
- **Database**: PostgreSQL (via Render)
- **Static Files**: WhiteNoise
- **Web Server**: Gunicorn
- **Environment Variables**:
  - `SECRET_KEY`
  - `DEBUG`
  - `DATABASE_URL`
  - `ALLOWED_HOSTS`
  - `CORS_ALLOWED_ORIGINS`
  - `CELERY_BROKER_URL`
  - `CELERY_RESULT_BACKEND`
  - `SCHOLARSHIPOWL_API_KEY`
  - `SGAI_API_KEY` (optional, for ScrapeGraphAI)

### Docker Support
- `Dockerfile` for containerized deployment
- `docker-compose.yml` for local PostgreSQL setup
- Entrypoint script for initialization

### Frontend Deployment
- Build command: `npm run build`
- Output: `dist/` directory
- Static hosting (Render, Vercel, Netlify, etc.)

---

## 🔧 Development Setup

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose up -d  # Start PostgreSQL
# Run migrations and server
```

### Celery Setup
```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Celery worker
celery -A university_api worker -l info

# Terminal 3: Start Celery beat (scheduler)
celery -A university_api beat -l info
```

---

## 📦 Dependencies

### Backend Key Dependencies
- Django 5.2.5
- djangorestframework 3.15.2
- djangorestframework-simplejwt 5.4.0
- django-cors-headers 4.7.0
- django-filter 24.3
- celery 5.3.6
- django-celery-beat 2.8.0
- django-celery-results 2.5.1
- redis 5.2.1
- psycopg2-binary (PostgreSQL)
- beautifulsoup4 (Web scraping)
- requests (HTTP client)
- scrapegraph_py (AI-powered scraping)
- pillow (Image processing)
- whitenoise (Static files)

### Frontend Key Dependencies
- react 19.2.0
- react-dom 19.2.0
- react-router-dom 7.9.5
- typescript 5.9.3
- vite 7.2.2
- tailwindcss 4.1.17
- @radix-ui/* (UI primitives)
- lucide-react (Icons)

---

## 🔐 Security Features

- JWT authentication
- CORS configuration
- CSRF protection
- Password validation
- Secure cookie settings (HTTPS)
- Environment variable management
- SQL injection protection (Django ORM)
- XSS protection (React)

---

## 📧 Email Configuration

- **Provider**: Gmail SMTP
- **Port**: 587 (TLS)
- **From Email**: addistemari.m@gmail.com
- **Email Types**:
  - Welcome emails (on registration)
  - Payment completion emails
  - Application status updates

---

## 🎯 API Authentication

- **Method**: JWT (JSON Web Tokens)
- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 24 hours
- **Header Format**: `Authorization: Bearer <token>`

---

## 📊 Data Scraping & External APIs

### University Scraping
- BeautifulSoup for HTML parsing
- ScrapeGraphAI for AI-powered extraction
- Requests caching (24-hour cache)
- Retry logic with exponential backoff
- Structured data extraction (JSON)

### Scholarship Integration
- ScholarshipOwl API
- Country-based filtering
- Cached results in database

---

## 🎮 Gamification System

### Points & Levels
- 100 points per level
- Points awarded for:
  - Profile completion
  - University interactions
  - Application submissions
  - Social activities
  - Milestones

### Achievements
- Categories: Profile, University, Application, Social, Milestone
- Unique achievements per user
- Points associated with each achievement

### Leaderboards
- Weekly rankings
- Monthly rankings
- All-time rankings
- Automatic ranking calculation

---

## 🌍 Internationalization

- **Languages**: English, Amharic
- **Implementation**: React Context API
- **Content Storage**: TypeScript object (`websiteContent.ts`)
- **Switching**: Language switcher component
- **Coverage**: Homepage, forms, UI elements

---

## 📝 Application Workflow

1. **Registration**: User creates account → Welcome email sent
2. **Profile Setup**: User completes profile → Points awarded
3. **Payment**: User initiates payment → Chapa gateway → Webhook confirmation
4. **Subscription Activation**: Payment verified → Subscription activated → Welcome email sent
5. **University Discovery**: Browse universities → Filter by criteria
6. **Application**: Add to planning → Submit application → Track status
7. **Content Access**: View opportunity posts → Access premium content (if subscribed)

---

## 🔄 Background Jobs

### Celery Tasks
- **Daily**: Check subscription expirations
- **On-demand**: Send emails
- **Scheduled**: Fetch scholarship data
- **Event-driven**: Application status updates

### Celery Beat Schedule
- Subscription expiry check: Every 24 hours

---

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI components

---

## 🧪 Testing

- Django test framework (backend)
- Test files in each app (`tests.py`)
- API endpoint testing
- Model validation testing

---

## 📈 Future Enhancements

Based on the codebase structure, potential enhancements:
- Real-time notifications (WebSockets)
- Advanced analytics dashboard
- Mobile app (React Native)
- Enhanced scraping capabilities
- More payment gateways
- Social features (user connections)
- Enhanced content creator tools
- Video tutorials integration
- Chat support system

---

## 📄 License & Credits

- **Project Name**: JobsAbroad / Nova Educational Consultancy / Addis Temari
- **Backend**: Django REST Framework
- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Deployment**: Render.com

---

## 📞 Support & Contact

- **Email**: addistemari.m@gmail.com
- **Contact Form**: Available in the application
- **Admin Panel**: `/admin/` (Django admin)

---

*Last Updated: Based on current codebase analysis*
*Documentation Version: 1.0*

