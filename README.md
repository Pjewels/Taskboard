# Task Management Dashboard By Priceless.
A Vue.js single-page application with TypeScript and Tailwind CSS for managing tasks.
Setup

Install Node.js: Ensure Node.js is installed (version 16 or higher).
Clone the Repository:git clone <repository-url>
cd task-dashboard


Install Dependencies:npm install


Run Locally:npm run dev

Open http://localhost:5173 in your browser.

Features

Add tasks with title, priority, category, and due date.
Filter tasks by status (All, Pending, Completed).
Sort tasks by priority or due date.
Persist tasks in local storage.
Responsive design with Tailwind CSS.

 # Deployment to Vercel

Install Vercel CLI:npm install -g vercel


Login to Vercel:vercel login


Deploy the Project:vercel

Follow the prompts to configure your project. Use the default settings for a Vite project:
Build Command: npm run build
Output Directory: dist
Development Command: npm run dev



Notes

Ensure you have a stable internet connection for Vercel deployment.
The app uses local storage to persist tasks; no backend is required.

