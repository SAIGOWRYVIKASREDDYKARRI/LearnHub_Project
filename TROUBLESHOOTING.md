# Troubleshooting Deployment Issues

If you are seeing "Login Failed" or other errors after deployment, follow these steps to find the cause.

## 1. Check the Browser Console (CORS Errors)
1.  Open your deployed frontend (e.g., on Vercel).
2.  Right-click anywhere and select **Inspect**.
3.  Go to the **Console** tab.
4.  Try to Login/Register.
5.  **Look for Red Errors**:
    - If you see `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy`, it means the backend is rejecting the frontend.
    - **Fix**: I have just updated the backend code to be more permissive. **You must redeploy the backend on Render** for this to take effect.

## 2. Check the Network Tab (Connection Errors)
1.  In the "Inspect" window, go to the **Network** tab.
2.  Try to Login again.
3.  Look for the request to `login` or `register` (it might verify `auth`).
4.  **Click on the failed request** (in red).
    - **Status 404**: The URL is wrong. Check if your `VITE_API_URL` in Vercel ends with `/api` (it should!).
    - **Status 500**: The backend crashed. Check Render logs.
    - **(failed) / Network Error**: The backend is not running or the URL is completely wrong.

## 3. Check Render Backend Logs
1.  Go to your [Render Dashboard](https://dashboard.render.com/).
2.  Click on your `learnhub-backend` service.
3.  Click **Logs** in the sidebar.
4.  Look for any error messages (e.g., `MongoNetworkError`, `Error: crash`).
    - If you see `MongoNetworkError`, checking your MongoDB IP Whitelist (allow access from anywhere `0.0.0.0/0` in Atlas).

## 4. Verify Environment Variables
- **Frontend (Vercel)**: Ensure `VITE_API_URL` is set to `https://your-backend.onrender.com/api` (no trailing slash after api).
- **Backend (Render)**: Ensure `MONGO_URI` and `JWT_SECRET` are exactly the same as your local `.env`.
