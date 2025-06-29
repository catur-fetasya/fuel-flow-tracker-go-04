
# Frontend Setup Guide

## Configuration Changes Made

The frontend has been completely migrated from Supabase to use local PHP backend API.

### Key Changes:

1. **New API Client** (`src/lib/api.ts`)
   - Handles all HTTP requests to PHP backend
   - JWT token management
   - File upload support

2. **Updated Auth Context** (`src/contexts/AuthContext.tsx`)
   - Uses local API instead of Supabase auth
   - Token-based authentication

3. **Updated Hooks**
   - `useAuthActions.ts` - Login/register with local API
   - `useUnits.ts` - Fetch units from local API  
   - `useLogs.ts` - Create logs via local API
   - `useProfiles.ts` - Manage profiles via local API

### Backend URL Configuration

Update the API base URL in `src/lib/api.ts` if your backend is not at `http://localhost/backend`:

```typescript
const API_BASE_URL = 'http://your-domain.com/path-to-backend';
```

### Next Steps:

1. Set up the PHP backend following backend/README.md
2. Import the database schema
3. Update API_BASE_URL if needed
4. Test the login functionality

All existing frontend functionality should work with the new backend!
