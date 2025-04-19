// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyABTO2mkzFxgn3lpMB55Yvz6X2ZaE0_MG8",
    authDomain: "cozy-ai.firebaseapp.com",
    projectId: "cozy-ai",
    storageBucket: "cozy-ai.firebasestorage.app",
    messagingSenderId: "530814933569",
    appId: "1:530814933569:web:5cec462692236bf81584c0",
    measurementId: "G-99CGTGGJKG"
};

try {
    // Initialize Firebase only once
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Make these available globally
    window.auth = firebase.auth();
    window.provider = new firebase.auth.GoogleAuthProvider();
    
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}