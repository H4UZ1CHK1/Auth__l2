import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const firebaseConfig = {
        apiKey: "AIzaSyBJOoqN0gTQBZqKaMWCHuerX_C2e6KYkA4",
        authDomain: "webprogramming-8d7cc.firebaseapp.com",
        databaseURL: "https://webprogramming-8d7cc-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "webprogramming-8d7cc",
        storageBucket: "webprogramming-8d7cc.appspot.com",
        messagingSenderId: "707513958003",
        appId: "1:707513958003:web:1f34368f3ba8cbfbe4f406",
        measurementId: "G-K5D6E5K3PP"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);

    const form = document.getElementById("registrationForm");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();

            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                alert("All fields are required.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userId = userCredential.user.uid;

                await set(ref(db, `users/${userId}`), {
                    firstName,
                    lastName,
                    email,
                    registrationDate: new Date().toISOString()
                });

                window.location.href = `userinfo.html?userId=${userId}`;
            } catch (error) {
                console.error("Error during registration:", error);
                alert("Error during registration. Please try again.");
            }
        });
    }

    async function loadUserData() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");

        if (!userId) {
            alert("User ID not provided. Redirecting to the registration page.");
            window.location.href = "index.html";
            return;
        }

        try {
            const userRef = ref(db, `users/${userId}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();

                document.getElementById("name").textContent = `${userData.firstName} ${userData.lastName}`;
                document.getElementById("email").textContent = userData.email;
                document.getElementById("date").textContent = new Date(userData.registrationDate).toLocaleDateString();
            } else {
                alert("User not found.");
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            alert("Failed to load user data. Please try again.");
        }
    }

    if (document.body.id === "userinfo") {
        loadUserData();
    }

    const loginButton = document.querySelector(".login-button");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                alert("Please fill in both email and password.");
                return;
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User signed in: ", userCredential.user);
                alert("Login successful!");

                const userId = userCredential.user.uid;
                window.location.href = `userinfo.html?userId=${userId}`;
            } catch (error) {
                console.error("Error during login: ", error);
                alert("Login failed. Please check your credentials.");
            }
        });
    }
});
