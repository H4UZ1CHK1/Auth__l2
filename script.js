document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const registrationFormContainer = document.getElementById("registrationFormContainer");
    const startButtonContainer = document.querySelector(".start-button-container");

    if (startButton) {
        startButton.addEventListener("click", function () {
            startButtonContainer.style.display = "none";
            registrationFormContainer.style.display = "block";
        });
    }

    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const userData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            nickname: document.getElementById("nickname").value,
            phone: document.getElementById("phone").value,
            gender: document.getElementById("gender").value,
            email: document.getElementById("email").value,
            avatar: document.getElementById("avatarPreview").src || "",
        };

        if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
            alert("All fields are required.");
            return;
        }

        localStorage.setItem("userData", JSON.stringify(userData));

        window.location.href = "userinfo.html";
    });

    const generatePasswordButton = document.getElementById("generatePassword");
    if (generatePasswordButton) {
        generatePasswordButton.addEventListener("click", function () {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let password = "";
            for (let i = 0; i < 16; i++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            document.getElementById("password").value = password;
            document.getElementById("confirmPassword").value = password;
        });
    }

    const avatarInput = document.getElementById("avatar");
    if (avatarInput) {
        avatarInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            const preview = document.getElementById("avatarPreview");

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const genderSelect = document.getElementById("gender");
    if (genderSelect) {
        genderSelect.addEventListener("change", function () {
            console.log("Selected gender:", genderSelect.value);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
            document.getElementById("name").textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById("nickname").textContent = userData.nickname;
            document.getElementById("email").textContent = userData.email;
            document.getElementById("phone").textContent = userData.phone;
            document.getElementById("gender").textContent = userData.gender;
            document.getElementById("date").textContent = userData.registrationDate;

            const avatarElement = document.getElementById("avatar");
            if (userData.avatar) {
                avatarElement.src = userData.avatar;
            } else {
                avatarElement.alt = "No Avatar Uploaded";
            }
        } else {
            alert("User data not found. Redirecting to registration page.");
            window.location.href = "registration.html";
        }
    });

    function logout() {
        localStorage.removeItem("userData");
    }

});



    
