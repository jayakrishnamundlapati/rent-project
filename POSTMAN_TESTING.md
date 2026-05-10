# MongoDB Authentication API - Postman Testing Guide

## Server Endpoints
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017/rent-project

## Authentication Endpoints

### 1. SIGNUP
**Method**: POST  
**URL**: http://localhost:5000/api/auth/signup  
**Headers**: 
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response (201)**:
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "mongodb_object_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

**Test Cases**:
- ✅ Valid signup with all fields
- ❌ Missing fields (should return 400)
- ❌ Invalid email format (should return 400)
- ❌ Phone not 10 digits (should return 400)
- ❌ Password < 6 characters (should return 400)
- ❌ Passwords don't match (should return 400)
- ❌ Duplicate email (should return 409)
- ❌ Duplicate phone (should return 409)

---

### 2. LOGIN
**Method**: POST  
**URL**: http://localhost:5000/api/auth/login  
**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "mongodb_object_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

**Cookie Set**: `token` (httpOnly, secure, sameSite=strict)

**Test Cases**:
- ✅ Valid login with correct credentials
- ❌ Missing email (should return 400)
- ❌ Missing password (should return 400)
- ❌ Invalid email format (should return 400)
- ❌ Wrong password (should return 401)
- ❌ Email doesn't exist (should return 401)

---

### 3. GET CURRENT USER (Protected Route)
**Method**: GET  
**URL**: http://localhost:5000/api/auth/me  
**Headers**:
```
Cookie: token=<JWT_TOKEN>
```

**Expected Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "mongodb_object_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

**Test Cases**:
- ✅ Valid token (should return user data)
- ❌ Missing token (should return 403)
- ❌ Invalid token (should return 401)
- ❌ Expired token (should return 401)

---

### 4. LOGOUT
**Method**: POST  
**URL**: http://localhost:5000/api/auth/logout  
**Headers**:
```
Content-Type: application/json
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Testing Steps in Postman

### Step 1: Signup a New User
1. Create new POST request to `http://localhost:5000/api/auth/signup`
2. Set header: `Content-Type: application/json`
3. Paste signup request body
4. Click **Send**
5. Check response for success and JWT cookie

### Step 2: Login with Same User
1. Create new POST request to `http://localhost:5000/api/auth/login`
2. Set header: `Content-Type: application/json`
3. Paste login request body
4. Click **Send**
5. Verify JWT token is set in cookies

### Step 3: Get Current User (Protected)
1. Create new GET request to `http://localhost:5000/api/auth/me`
2. Postman should automatically include the cookie from previous login
3. Click **Send**
4. Should return user data

### Step 4: Test Invalid Cases
- Try login with wrong password
- Try signup with duplicate email
- Try GET /me without logging in first

---

## Environment Variables in .env

Make sure your `.env` file has:
```
MONGODB_URI=mongodb://localhost:27017/rent-project
TOKEN_KEY=your_super_secret_jwt_key_change_this_in_production
BACKEND_PORT=5000
FRONTEND_PORT=3000
NODE_ENV=development
```

---

## Security Features Implemented

✅ **Bcrypt Hashing**: Passwords hashed with 10 salt rounds  
✅ **JWT Tokens**: Expires in 7 days  
✅ **httpOnly Cookies**: Prevents XSS attacks  
✅ **Input Validation**: Email, phone, password format checks  
✅ **Duplicate Prevention**: Unique email and phone constraints  
✅ **Token Verification Middleware**: Protects routes  
✅ **CORS with Credentials**: Allows cross-origin requests with cookies

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify database name matches: `mongodb://localhost:27017/rent-project`

### Token Not Being Set
- Check that requests include `credentials: 'include'`
- Verify CORS allows credentials in backend
- Ensure httpOnly cookies are enabled

### 403 Authentication Token Required
- Not sending JWT token in request
- Token might be expired (7 days)
- Try logging in again to get fresh token

### Port Already in Use
- Backend: `lsof -i :5000` and `kill -9 <PID>`
- Frontend: `lsof -i :3000` and `kill -9 <PID>`
