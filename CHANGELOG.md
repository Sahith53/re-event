# Changelog

All notable changes to the re:Event project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Initial CHANGELOG.md file to track project changes
- Beginner learning documentation structure
- Analysis of current payment integration status
- **UNIFIED AUTHENTICATION SYSTEM:**
  - Updated User model to support multiple auth providers (`backend/models/user.js`)
  - Created AuthService for unified authentication (`backend/controllers/authService.js`)
  - Added Google authentication endpoint (`/google-auth`)
  - Added auth provider management endpoints (`/auth-providers/:email`, `/link-auth-provider`)
  - Modified verifyOtp to use unified AuthService
  - Enhanced JWT tokens to include authProviders information
- **🎉 GOOGLE AUTHENTICATION FULLY IMPLEMENTED:**
  - Firebase configuration setup (`frontend/src/config/firebase.js`)
  - Google Sign-In integration in login component (`frontend/src/components/Login/LogSign.jsx`)
  - Firebase Admin SDK integration for token verification (`backend/controllers/LoginController.js`)
  - Simplified Google auth backend handler compatible with existing User model
  - Cross-origin domain authorization for production deployment
  - Environment variables configuration for production (JWT_SECRET, MONGO_URI)
  - **COMPLETE FLOW:** Google popup → Firebase token → Backend verification → User creation/login → JWT token → Dashboard redirect

### Changed
- Updated OTP verification to use new AuthService instead of direct user creation
- Modified user response format to include authentication provider information
- Enhanced user model with authProviders, profile data, and verification status
- **Google auth button now fully functional** (previously placeholder)
- Updated frontend `handleGoogleSignIn` function with proper error handling and loading states
- Modified backend Google auth to work with simplified User model structure
- Improved username handling for Google users (uses display name or email prefix instead of timestamp)

### Fixed
- Resolved React key warning in EventCard components (`frontend/src/components/Dashboard/UpcomingEvents.jsx`)
- Fixed Google authentication 404 errors by properly deploying backend routes to production
- Resolved Firebase unauthorized domain errors by adding production domains to Firebase console
- Fixed API URL configuration issues between development and production environments
- Corrected environment variable setup on Render deployment platform
- **Display Event Titles in Profile** – Replaced event codes with human-readable event titles in Created Events section (`frontend/src/components/ProfileItems/MyEvents.jsx`)

### Security
- Implemented Firebase token verification on backend to prevent token tampering
- Added proper CORS configuration for cross-origin requests
- Environment variables properly secured on production deployment
- JWT token security maintained with proper expiration (24h) and secret key

### Notes
- **AUTHENTICATION SYSTEM UNIFIED:** Both OTP and Google auth now use the same email-based user matching
- **GOOGLE AUTH COMPLETE:** Full integration from Firebase setup to production deployment
- Payment integration mentioned in README/resume but not implemented in current codebase
- Project currently supports: Unified auth (OTP + Google), event management, email notifications, QR check-ins
- **DEPLOYMENT:** Successfully deployed to production with working Google authentication on Vercel + Render

### Deprecated
- (Nothing deprecated yet)

### Removed
- (Nothing removed yet)

### Fixed
- (No fixes yet)

### Security
- (No security updates yet)

---

## How to use this CHANGELOG

### Categories (What each section means):
- **Added**: New features or functionality you've added
- **Changed**: Changes to existing features 
- **Deprecated**: Features that still work but will be removed later
- **Removed**: Features that have been completely removed
- **Fixed**: Bug fixes or corrections
- **Security**: Security improvements or fixes

### Format for entries:
- Use present tense ("Add feature" not "Added feature")
- Be specific about what changed
- Include file names when relevant
- Date your releases

### Example entry:
```
## [1.0.1] - 2024-01-15
### Added
- Login functionality in `frontend/src/components/Login/LogSign.jsx`
- User authentication API in `backend/controllers/authController.js`

### Fixed
- Fixed broken event creation form validation
- Resolved issue with event cards not displaying properly
``` 