npm init -y
npm install express socket.io bcrypt jsonwebtoken


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));

const users = []; // Временное хранилище пользователей

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('Пользователь зарегистрирован');
});

// Аутентификация пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, 'secret_key');
        res.json({ token });
    } else {
        res.status(401).send('Неверные учетные данные');
    }
});

// Middleware для проверки токена
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).send('Неверный токен');
            } else {
                req.user = decoded.username;
                next();
            }
        });
    } else {
        res.status(403).send('Токен не предоставлен');
    }
};

// Получение профиля пользователя
app.get('/profile', authenticate, (req, res) => {
    const user = users.find(u => u.username === req.user);
    if (user) {
        res.json({ username: user.username });
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

io.on('connection', (socket) => {
    console.log('Новый пользователь подключился');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
