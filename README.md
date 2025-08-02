# User Weather Application

A full-stack CRUD application for managing users with weather data integration. Built with Node.js/Express backend, React frontend, and comprehensive end-to-end testing.

## Technology Stack
- **Backend**: Node.js, Express, TypeScript, Firebase Realtime Database, Zod
- **Frontend**: React 19, Mantine UI, TanStack Query, TypeScript, Zod
- **Testing**: Playwright for E2E testing
- **Build Tools**: Vite, tsup, tsx for development workflow
- **External APIs**: OpenWeatherMap API for weather data

## Architecture
- **Monorepo Structure**: Used pnpm workspaces to organize code into logical packages
- **Packages**:
  - `packages/api`: Express.js REST API
  - `packages/web`: React frontend application
  - `packages/shared`: Common types and utilities
  - `packages/web-e2e`: Playwright test suite


## Key Design Decisions
1. **Firebase Realtime Database**: NoSQL database for quick setup and easy to use
2. **Mantine UI**: Modern React component library for consistent, accessible UI
3. **TanStack Query**: For efficient data fetching, caching, and state management
4. **Playwright**: Comprehensive E2E testing framework with excellent developer experience

## How to Run

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- OpenWeatherMap API Key
- Firebase Realtime Database

### Environment Setup
1. Create a `.env` file in the `packages/api` directory with:
```env
PORT=8000
NODE_ENV=development
WEATHER_API_KEY=your_openweathermap_api_key
FIREBASE_RTDB_URL=your_firebase_realtime_database_url
```

2. Provide a `firebase-service-account.json` file in the `packages/api` directory with:
```json
{
  "type": "service_account",
  "project_id": "your_project_id",
  "private_key_id": "your_private_key_id",
  "private_key": "your_private_key",
  "client_email": "your_client_email",
  "client_id": "your_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your_client_id"
}
```
Extract the file from the Firebase Console.

3. Create a `.env` file in the `packages/web` directory with:
```env
VITE_API_URL=http://localhost:8000/api
```

4. Create a `.env` file in the `packages/web-e2e` directory with:
```env
WEB_URL=http://localhost:5173
API_URL=http://localhost:8000/api
```

### Installation & Running
1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development servers:**
   ```bash
   pnpm dev
   ```
   This runs both API (port 8000) and web app (port 5173) concurrently.

4. **Access the application:**
   - Frontend: http://localhost:5173
   - API: http://localhost:8000
   - Health check: http://localhost:8000/health

### Running Tests
To run E2E tests with Playwright, use the following command:

```bash
pnpm test:e2e
```

Both servers will run in the background, and the tests will execute against them.

## What You Implemented

### Core Features
- ✅ **User CRUD Operations**
  - Create users with name and zipcode
  - Read/display all users in a table
  - Update existing user information
  - Delete users with confirmation
  
- ✅ **Weather Integration**
  - Automatic weather data fetching on user creation/update
  - Stores latitude, longitude, and timezone from OpenWeatherMap API
  - Validates zipcode through weather API calls

### Technical Implementation
- ✅ **API Endpoints**
  - `GET /api/users` - Fetch all users
  - `POST /api/users` - Create new user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
  - `GET /health` - Health check
  - `POST /api/e2e/clean` - Database cleanup for E2E tests

- ✅ **Data Validation**
  - Zod schemas for request/response validation
  - Client-side form validation
  - Server-side input sanitization

- ✅ **Error Handling**
  - SafeResult pattern for consistent error responses
  - Global error handling in React Query
  - Proper HTTP status codes
  - User-friendly error messages

## Assumptions Made

1. **Weather API**: Assumed OpenWeatherMap API is sufficient for zipcode-to-coordinates conversion
2. **Database**: Used Firebase Realtime Database for simplicity, assuming real-time updates aren't critical
3. **Authentication**: No authentication implemented - assumed this is a demo/internal application
4. **Deployment**: Assumed development/demo environment - production optimizations not implemented
5. **E2E Testing**: Implemented Playwright for end-to-end testing. Created a separate endpoint for E2E test database cleanup and used the same Firebase project for E2E tests.

## Testing Done

### End-to-End Testing with Playwright
Comprehensive test suite covering all CRUD operations:

#### Test Coverage
- ✅ **CREATE Operations**
  - User creation through modal form
  - Form validation (required fields)
  - Success notification verification
  - Table updates after creation
  - Invalid zipcode handling

- ✅ **READ Operations**
  - Table structure and headers
  - User data display verification

- ✅ **UPDATE Operations**
  - Edit user through modal
  - Successful update verification
  - Table refresh after update

- ✅ **DELETE Operations**
  - User deletion functionality
  - Success notification verification
  - Table updates after deletion

- ✅ **Form Validation**
  - Required field validation
  - Invalid input handling
  - Error state display

#### Test Features
- **Dynamic Test Data**: Uses timestamps to avoid conflicts
- **Database Cleanup**: Automated test data cleanup between runs

### Manual Testing
- ✅ API endpoints tested with various inputs using REST Client extension in VSCode
- ✅ Error handling tested with invalid data

### Test Environment
- Separate test database configuration
- Environment-specific API endpoints
- Automated test data cleanup
- Isolated test execution

---

## Project Structure
```
user-weather-training/
├── packages/
│   ├── api/           # Express.js backend
│   ├── web/           # React frontend
│   ├── shared/        # Common types & utilities
│   └── web-e2e/       # Playwright tests
├── package.json       # Root package configuration
└── pnpm-workspace.yaml # Workspace configuration
```

This application showcases a full-stack CRUD application with a focus on modern tooling, comprehensive end-to-end testing, and maintainable code organization.
