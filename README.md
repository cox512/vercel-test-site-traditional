# Intercom Test Site - Traditional Installation

A comprehensive test site for demonstrating Intercom messenger functionality and features including tours, surveys, events, and JWT authentication.

## Features

- **User Authentication**: JWT-based user authentication with Intercom
- **Interactive Tours**: Trigger and test Intercom product tours
- **Surveys**: Launch different types of Intercom surveys
- **Event Tracking**: Track custom events with metadata
- **Help Center Integration**: Direct link to Intercom help documentation
- **Responsive Design**: Mobile-friendly sidebar navigation
- **Modal Interfaces**: Clean modal dialogs for tour and event configuration

## Prerequisites

Before you begin, ensure you have:

- A GitHub account
- A Vercel account (free tier available)
- An Intercom workspace with admin access
- Node.js 18.x or higher (for local development)

## Quick Start

### 1. Clone the Repository

Before you can deploy to Vercel, you need to get a copy of the code on your computer. Here's how to do it step by step:

#### Step 1a: Fork the Repository (First Time Only)
1. **Go to the original repository**: Visit [https://github.com/cox512/vercel-test-site-traditional](https://github.com/cox512/vercel-test-site-traditional)
2. **Fork the repository**: Click the "Fork" button in the top-right corner of the page
3. **Create your fork**: GitHub will create a copy under your account (e.g., `https://github.com/YOUR-USERNAME/vercel-test-site-traditional`)

#### Step 1b: Open Your Terminal/Command Line
- **On Mac**: Press `Cmd + Space`, type "Terminal", and press Enter
- **On Windows**: Press `Win + R`, type "cmd", and press Enter
- **On Linux**: Press `Ctrl + Alt + T`

#### Step 1c: Navigate to Where You Want to Store the Project
```bash
# Navigate to your Desktop or Documents folder (or wherever you want to store the project)
cd Desktop

```

#### Step 1d: Clone Your Forked Repository
```bash
# Replace 'YOUR-USERNAME' with your actual GitHub username
git clone https://github.com/YOUR-USERNAME/vercel-test-site-traditional.git
```

**What this does**: Downloads a complete copy of the project code to your computer.

#### Step 1e: Enter the Project Directory
```bash
# Navigate into the project folder that was just created
cd vercel-test-site-traditional
```

**What this does**: Changes your current location to inside the project folder so you can work with the files.

#### Step 1f: Install Project Dependencies (Optional - Only for Local Development)
```bash
# Install the required packages (only needed if you plan to run the project locally)
npm install
```

**What this does**: Downloads and installs all the code libraries this project needs to run.

**Note**: You only need to run `npm install` if you plan to test the site on your computer before deploying to Vercel. If you're going straight to Vercel deployment, you can skip this step.

#### Verify Everything Worked
After running these commands, you should see a folder called `vercel-test-site-traditional` on your Desktop (or wherever you chose to clone it). This folder contains all the project files you'll need for deployment.

### 2. Connect to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Continue with GitHub" to sign in with your GitHub account
   - Authorize Vercel to access your GitHub repositories when prompted

2. **Create a New Project**
   - Once logged in, click the "New Project" button on your Vercel dashboard
   - You'll be taken to the "Import Git Repository" page

3. **Import Your Forked Repository**
   - **Find your repository**: Look for `vercel-test-site-traditional` in the list of repositories
   - If you don't see it immediately:
     - Use the search bar at the top to search for "vercel-test-site-traditional"
     - Make sure you're looking under your GitHub username
     - If it's still not visible, click "Adjust GitHub App Permissions" to grant Vercel access to more repositories
   - **Import the repository**: Click the "Import" button next to your forked repository

4. **Configure Project Settings**
   - **Project Name**: Vercel will auto-populate this (you can change it if desired)
   - **Framework Preset**: Vercel should automatically detect "Other" or "Node.js"
   - **Root Directory**: Leave as "./" (default)
   - **Build Command**: Should auto-populate with `npm run build` (or leave empty - Vercel will handle it)
   - **Output Directory**: Leave empty (Vercel will auto-detect)
   - **Install Command**: Should auto-populate with `npm install`

5. **Deploy**
   - Click "Deploy" button
   - Vercel will start building and deploying your project
   - Wait for the build to complete (usually takes 1-2 minutes)
   - You'll get a success message with your deployment URL

**Important Note**: Your project will deploy but won't function properly until you add the required environment variables (covered in step 3 below).

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel

# Follow the prompts to configure your project
```

### 3. Configure Environment Variables

You'll need to set up the following environment variables in your Vercel project:

#### Required Environment Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `INTERCOM_APP_ID` | Your Intercom application ID | Intercom Settings → Installation → Web |
| `INTERCOM_JSON_SECRET` | Secret key for JWT token generation | Intercom Settings → Authentication → Identity Verification |
| `TRIGGER_TOUR_ID` | Tour ID for the trigger tour button | Intercom Product Tours → ID for the Tour of your choosing  |
| `TOUR_LINK_ID` | Tour ID for direct tour links | Intercom Product Tours → ID for the Tour of your choosing |
| `LARGE_SURVEY_ID` | Survey ID for the large survey | Intercom Surveys → ID for the Large Survey of your choosing |
| `SMALL_SURVEY_ID` | Survey ID for the small survey | Intercom Surveys → ID for the Small Survey of your choosing |
| `SURVEY_LINK_ID` | Survey ID for direct survey links | Intercom Surveys → ID for the Survey of your choosing |

#### Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your deployed project
3. Click on the "Settings" tab in the nav bar that runs across the top of the page
4. Click the "Environment Variables" in the left-hand sidebar
5. Add each of the variables below with their corresponding value:

```
INTERCOM_APP_ID=your_app_id_here
INTERCOM_JSON_SECRET=your_secret_key_here
TRIGGER_TOUR_ID=tour_id
TOUR_LINK_ID=tour_id
LARGE_SURVEY_ID=survey_id
SMALL_SURVEY_ID=survey_id
SURVEY_LINK_ID=survey_id
```

6. Click "Save" after adding all the variables
7. Redeploy your application to apply the changes

## Local Development

To run the project locally for development:

```bash
# Create a .env file in the root directory
touch .env

# Add your environment variables to .env
echo "INTERCOM_APP_ID=your_app_id" >> .env
echo "INTERCOM_JSON_SECRET=your_secret_key" >> .env
# ... add other variables from above

# Start the development server
npm run dev

# Open your browser to http://localhost:3000
```

## Project Structure

```
├── api/
│   └── generate-jwt.js      # Serverless function for JWT generation
├── public/
│   ├── scripts.js           # Client-side JavaScript
│   ├── styles.css           # CSS styles
│   └── helpcenter-icon.svg  # Help center icon
├── routes/
│   └── index.js             # Express routes
├── views/
│   ├── head.ejs             # HTML head template
│   ├── landing.ejs          # Main landing page
│   ├── messenger-visitor.ejs # Intercom messenger setup
│   ├── new-tab.ejs          # New tab test page
│   └── page-two.ejs         # Dropdown test page
├── app.js                   # Express server setup
├── package.json             # Dependencies and scripts
└── vercel.json              # Vercel configuration
```

## Usage

Once deployed, your test site will have:

### Navigation Sidebar
- **Bot Actions**: Trigger an Intercom workflow with a button (you will need to set up the "Customer clicks an Element" Workflow and select the "Trigger Workflow" button as the trigger)
- **Tours**: Start product tours via the 'startTour' JS method or via a tour link
- **Surveys**: Launch surveys using the 'startSurvey' JS method or via a survey link
- **Events**: Track custom events with metadata
- **Navigation**: Links to additional test pages for testing behavior on page change and the opening of new tabs
- **Help & Support**: Direct access to help center

### User Authentication
1. Fill in the user details form
2. Click "Boot User" to authenticate with Intercom
3. JWT tokens are automatically generated and applied

### Testing Features
- Use the sidebar buttons to test various Intercom features
- Open modals to configure tours and events with custom parameters
- Update User Custom Data Attributes

## Troubleshooting

### Common Issues

**JWT not working**:
- Verify `INTERCOM_JSON_SECRET` is correctly set in Vercel environment variables
- Check that JWT is enabled in your Intercom workspace see instructions in the Intercom Help Center if you run into issues.

**Tours/Surveys not triggering**:
- Ensure the tour/survey IDs are correct and active in your Intercom workspace

**404 errors on deployment**:
- Check that `vercel.json` is properly configured
- Verify all environment variables are set in Vercel dashboard

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Review Vercel deployment logs
3. Verify all environment variables are correctly set
4. Ensure your Intercom workspace is properly configured

## License

This project is open source and available under the [MIT License](LICENSE).
