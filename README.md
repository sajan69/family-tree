
# Family Tree Project: User Guide

## Introduction

The Family Tree project is a web-based application designed to digitize and visualize family trees. It offers an interactive platform for families to explore their lineage, update information, and maintain a comprehensive record of their family history.

## Key Features

1. Interactive Family Tree Visualization
2. User Authentication System
3. Family Member Search Functionality
4. Data Update Capability for Authenticated Users
5. Multilingual Support (English and Nepali)
6. Responsive Design for Various Devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/sajan/family-tree.git
   cd family-tree
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase and Cloudinary credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Customization

To customize the Family Tree project for your own family, follow these steps:

### 1. Update Family Configuration

Edit the `src/config/familyConfig.json` file:

```json
{
    "familyName": "Your Family Name",
    "familyNepaliName": "Your Family Name in Nepali",
    "familyTreeTitleKey": "familyTreeTitle",
    "welcomeMessageKey": "welcome",
    "exploreMessageKey": "explore",
    "copyrightMessageKey": "copyright",
    "logoAltKey": "logoAlt",
    "logoPath": "/your-logo.png"
}
```

- Change `familyName` to your family's name in English.
- Change `familyNepaliName` to your family's name in Nepali (if applicable).
- Update `logoPath` to the path of your family logo image.

### 2. Customize Translations

Update the translation files for your family's languages:

For English, edit `src/locales/english.json`:

```json
{
  "familyTreeTitle": "{{familyName}} Family Tree",
  "welcome": "Welcome to the {{familyName}} Family Tree",
  "explore": "Explore your family history and keep your family connections strong.",
  "copyright": "© {{currentYear}} {{familyName}} Family Tree. All rights reserved.",
  "logoAlt": "{{familyName}} Family Tree Logo"
}
```

For Nepali, edit `src/locales/nepali.json`:

```json
{
  "familyTreeTitle": "{{familyNepaliName}} वंश वृक्ष",
  "welcome": "{{familyNepaliName}} वंश वृक्षमा स्वागत छ",
  "explore": "आफ्नो परिवारको इतिहास अन्वेषण गर्नुहोस् र आफ्नो परिवारको सम्बन्धहरू बलियो राख्नुहोस्।",
  "copyright": "© {{currentYear}} {{familyNepaliName}} वंश वृक्ष। सर्वाधिकार सुरक्षित।",
  "logoAlt": "{{familyNepaliName}} वंश वृक्ष लोगो"
}
```

Replace `{{familyName}}` and `{{familyNepaliName}}` with your actual family names if you prefer not to use the dynamic replacement.

### 3. Update Color Scheme (Optional)

To change the color scheme, modify the Tailwind CSS classes in the components. For example, in `src/app/page.tsx`:

```typescript
<div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4">
```

Change the background gradient colors to match your preferred scheme.

### 4. Customize Logo

Replace the logo file at the path specified in `familyConfig.json` with your own family logo.

### 5. Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Set up Firebase Authentication and Realtime Database.
3. Update the Firebase configuration in your `.env.local` file with your project's credentials.

### 6. Cloudinary Setup (for image handling)

1. Create a Cloudinary account at [https://cloudinary.com/](https://cloudinary.com/)
2. Update the Cloudinary configuration in your `.env.local` file with your account credentials.

## Usage

### Viewing the Family Tree

1. Navigate to the home page.
2. Click on "View Family Tree" to see the interactive family tree visualization.

### Updating Family Data

1. Log in using the provided authentication system.
2. Navigate to the "Update Data" page.
3. Use the form to add new family members or update existing information from the family tree page directly.

### Searching for Family Members

Use the search functionality on the Family Tree page to quickly find specific family members.

### Changing Language

Use the language selector in the sidebar to switch between English and Nepali.

## Deployment

To deploy your customized Family Tree project:

1. Build the project:
   ```
   npm run build
   ```

2. Deploy to your preferred hosting platform (e.g., Vercel, Netlify, or Firebase Hosting).

## Support and Contributions

For support or to contribute to the project, please open an issue or pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
