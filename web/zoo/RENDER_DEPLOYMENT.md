# Render.com Deployment Guide for Cookie Issues

## Problem
When deploying to Render.com with a custom subdomain, cookies are not being sent properly due to domain and CORS configuration issues.

## Solution

### 1. Environment Variables Setup on Render.com

Add these environment variables in your Render.com service settings:

```
ENVIRONMENT=production
RENDER=true
DOMAIN=yourcustomdomain.com
COOKIE_DOMAIN=yourcustomdomain.com
FRONTEND_URL=https://yourcustomdomain.com
```

**Important**: Replace `yourcustomdomain.com` with your actual custom domain.

### 2. Cookie Configuration

The backend now dynamically configures cookies based on environment variables:

- **Development**: Uses localhost, non-secure cookies
- **Production**: Uses your custom domain, secure HTTPS cookies

### 3. CORS Configuration

The CORS middleware now accepts origins based on:
- `FRONTEND_URL` environment variable
- Requests from domains containing your `DOMAIN` value

### 4. Frontend Configuration

Make sure your frontend API calls use `withCredentials: true` (already configured in `api.ts`).

### 5. Custom Domain Setup

1. Configure your custom domain in Render.com dashboard
2. Ensure SSL/TLS is enabled (should be automatic)
3. Set the environment variables as shown above

### 6. Testing

After deployment:
1. Test login functionality
2. Check browser developer tools → Network tab
3. Verify cookies are being set with correct domain
4. Verify subsequent requests include the cookie

### Common Issues

1. **Mixed Content**: Ensure both frontend and backend use HTTPS in production
2. **Subdomain Issues**: Make sure cookie domain matches your actual domain
3. **CORS Errors**: Verify FRONTEND_URL matches your frontend domain exactly

### Environment Variables Example

For a domain like `myapp.render.com`:
```
ENVIRONMENT=production
RENDER=true
DOMAIN=myapp.render.com
COOKIE_DOMAIN=myapp.render.com
FRONTEND_URL=https://myapp.render.com
```

For a custom domain like `myapp.com`:
```
ENVIRONMENT=production
RENDER=true
DOMAIN=myapp.com
COOKIE_DOMAIN=myapp.com
FRONTEND_URL=https://myapp.com
```
