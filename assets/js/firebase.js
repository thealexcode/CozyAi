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

// Initialize Firebase
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded');
} else {
    try {
        // Initialize only if no apps exist
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
        }
        
        // Set auth and provider globally
        window.auth = firebase.auth();
        window.provider = new firebase.auth.GoogleAuthProvider();
        
        // Add persistence
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log("Auth persistence set to LOCAL");
            })
            .catch((error) => {
                console.error("Error setting auth persistence:", error);
            });
            
        // Verify initialization
        console.log("Firebase auth available:", !!window.auth);
        
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
}