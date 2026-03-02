## Environment Variables

This project uses environment variables for secrets.  
Create a `.env` file in the project root directory.

Example:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
EMAIL_USER=your gmail id
EMAIL_PASS=your app password

In production (Render, Vercel, etc.), set these variables in the platform’s Environment settings.
