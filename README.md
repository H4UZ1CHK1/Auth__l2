Добавлен атрибут required к <select>. Поле выбора пола (<select>) не имело атрибута required, что позволяло пользователю отправить форму, не выбрав пол:
<select id="gender" name="gender" required>

Не было проверки что пароль и его подтверждение совпадают. Пользователь может ввести два разных пароля и успешно отправить форму:
document.getElementById("avatar").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("avatarPreview");
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

