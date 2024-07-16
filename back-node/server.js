// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Client } = require('pg');
const sequelize = require('./db');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Configura el cliente de PostgreSQL
const pgClient = new Client({
  connectionString: 'postgres://postgres:NoSabe89@localhost:5432/mydatabase'
});

pgClient.connect();

pgClient.query('LISTEN user_changes');

pgClient.on('notification', async (msg) => {
  const payload = JSON.parse(msg.payload);

  // Emitir diferentes eventos según el tipo de cambio
  switch (payload.type) {
    case 'create':
      io.emit('userCreated', payload.user);
      break;
    case 'update':
      io.emit('userUpdated', payload.user);
      break;
    case 'delete':
      io.emit('userDeleted', payload.user);
      break;
  }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  User.findAll().then(users => {
    socket.emit('initialData', users);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

sequelize.sync().then(() => {
  server.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
  });
});
