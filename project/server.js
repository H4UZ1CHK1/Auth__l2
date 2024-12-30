// const express = require('express');
// const cors = require('cors'); 
// const fs = require('fs'); 
// const path = require('path');

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// const dbPath = path.join(__dirname, 'db.json'); 

// app.post('/save', (req, res) => {
//     const data = req.body;

//     fs.readFile(dbPath, 'utf8', (err, fileData) => {
//         if (err && err.code !== 'ENOENT') {
//             return res.status(500).json({ error: 'Ошибка чтения базы данных' });
//         }

//         const db = fileData ? JSON.parse(fileData) : [];
//         db.push(data);

//         fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Ошибка сохранения данных' });
//             }
//             res.status(200).json({ message: 'Данные сохранены' });
//         });
//     });
// });

// app.get('/data', (req, res) => {
//     fs.readFile(dbPath, 'utf8', (err, fileData) => {
//         if (err && err.code !== 'ENOENT') {
//             return res.status(500).json({ error: 'Ошибка чтения базы данных' });
//         }

//         const db = fileData ? JSON.parse(fileData) : [];
//         res.status(200).json(db);
//     });
// });

// const PORT = 5000; 
// app.listen(PORT, () => {
//     console.log(`Сервер запущен на http://localhost:${PORT}`);
// });
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000; // Можно оставить текущий порт
const dbPath = path.join(__dirname, 'db.json'); // Путь к JSON-файлу для хранения данных

// Настройка сессий
app.use(session({
    secret: 'your-secret-key', // Замените на более сложный ключ для безопасности
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Установите true, если используете HTTPS
}));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Функции для работы с базой данных
const readDatabase = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) return reject(err);
            resolve(data ? JSON.parse(data) : { Users: [] });
        });
    });
};

const writeDatabase = (db) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

// Роуты
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Используем ваш текущий HTML для регистрации
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Создайте страницу для входа
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        registrationDate: new Date().toISOString()
    };

    try {
        const db = await readDatabase();

        if (db.Users.some(user => user.email === email)) {
            return res.status(400).send('Пользователь с таким email уже существует');
        }

        db.Users.push(newUser);
        await writeDatabase(db);
        res.redirect('/login');
    } catch (err) {
        console.error('Ошибка при регистрации:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await readDatabase();
        const user = db.Users.find(user => user.email === email);

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.status(401).send('Неверный email или пароль');
        }
    } catch (err) {
        console.error('Ошибка при входе:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user = req.session.user;
    res.send(`
        <h1>Добро пожаловать, ${user.firstName} ${user.lastName}</h1>
        <p>Email: ${user.email}</p>
        <p>Дата регистрации: ${user.registrationDate}</p>
        <a href="/logout">Выйти</a>
    `);
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Ошибка завершения сессии:', err);
            return res.status(500).send('Ошибка сервера');
        }
        res.redirect('/login');
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
