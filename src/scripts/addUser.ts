const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function addUser(username, password) {
    const usersRef = ref(database, 'users');
    const newUserRef = push(usersRef);
    const newUser = { username, password };
    set(newUserRef, newUser)
        .then(() => {
            console.log(`User ${username} added successfully`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error adding user:', error);
            process.exit(1);
        });
}

addUser('admin', 'password');