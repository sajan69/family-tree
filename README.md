# Family Tree Project

## Project Overview

The Family Tree project is a web-based application designed to digitize and visualize the family tree of any family. This interactive platform allows family members to explore their lineage, update family information, and maintain a comprehensive record of their family history.

## Key Features

1. Interactive Family Tree Visualization
2. User Authentication System
3. Family Member Search Functionality
4. Data Update Capability for Authenticated Users
5. Multilingual Support
6. Responsive Design for Various Devices

## User Interface Components

### Home Page
The home page serves as the entry point for the application. It provides a welcoming interface with options to view the family tree or log in to update family data.

### Family Tree Page
This page displays the interactive family tree visualization. Users can zoom in/out, pan across the tree, and click on individual members to view more details.

### Update Data Page
Authenticated users can access this page to add new family members or update existing information.

### Dynamic Sidebar
A collapsible sidebar provides navigation options and user authentication controls.

## Functionality

### Family Tree Visualization
The family tree is rendered using a hierarchical structure, with each family member represented by a node. The tree is zoomable and pannable for easy navigation.

### User Authentication
The application implements a simple authentication system using local storage. Users can log in to access additional features like updating family data.

### Data Management
Family member data is stored and retrieved using Firebase Realtime Database. Authenticated users can add new members or update existing information through a form interface.

### Search Functionality
Users can search for specific family members using the search feature, which helps in quickly locating individuals within large family trees.

### Internationalization
The application supports multiple languages, enhancing accessibility for family members across different regions.

## Technical Stack

- Frontend Framework: Next.js (React)
- Styling: Tailwind CSS
- Database: Firebase Realtime Database
- State Management: React Hooks
- Internationalization: react-i18next
- Icons: react-icons
- Image Handling: next-cloudinary

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/sajan69/family-tree.git
   ```

2. Install dependencies
   ```
   cd family-tree
   npm install
   ```

3. Set up environment variables
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

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Enhancements

1. Advanced search filters (e.g., by generation, location)
2. Family member profile pages with more detailed information
3. Timeline view of family history
4. Integration with genealogy databases for additional historical information
5. Mobile app version for easier access on smartphones

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


