import { initializeApp } from "./firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("User signed in:", userCredential.user);
  })
  .catch((error) => {
    console.error("Error signing in:", error);
  });

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
    const db = getFirestore(app);

    const form = document.getElementById("registrationForm");
    const avatarInput = document.getElementById("avatar");
    const avatarPreview = document.getElementById("avatarPreview");

    function getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    if (avatarInput) {
        avatarInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    avatarPreview.src = e.target.result;
                    avatarPreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                avatarPreview.src = "";
                avatarPreview.style.display = "none";
                alert("Please upload a valid image file.");
                avatarInput.value = "";
            }
        });
    }

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); 

            const password = getInputValue("password");
            const confirmPassword = getInputValue("confirmPassword");

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const userData = {
                firstName: getInputValue("firstName"),
                lastName: getInputValue("lastName"),
                nickname: getInputValue("nickname"),
                phone: getInputValue("phone"),
                gender: getInputValue("gender"),
                email: getInputValue("email"),
                avatar: avatarPreview.src || "",
                registrationDate: new Date().toISOString()
            };

            if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
                alert("All fields are required.");
                return;
            }

            try {
                const docRef = await addDoc(collection(db, "users"), userData);
                console.log("User added with ID: ", docRef.id);
                alert("Registration successful!");
                window.location.href = `userinfo.html?userId=${docRef.id}`;
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error saving user data.");
            }
        });
    }

    async function loadUserData() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");

        if (!userId) {
            alert("User ID not provided. Redirecting to the home page.");
            window.location.href = "index.html";
            return;
        }

        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById("name").textContent = `${userData.firstName} ${userData.lastName}`;
                document.getElementById("nickname").textContent = userData.nickname;
                document.getElementById("email").textContent = userData.email;
                document.getElementById("phone").textContent = userData.phone;
                document.getElementById("gender").textContent = userData.gender;
                document.getElementById("date").textContent = new Date(userData.registrationDate).toLocaleDateString();

                const avatarElement = document.getElementById("avatar");
                if (avatarElement) {
                    avatarElement.src = userData.avatar || "default-avatar.png";
                }
            } else {
                alert("User not found.");
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    if (document.body.id === "userinfo") {
        loadUserData();
    }
});
