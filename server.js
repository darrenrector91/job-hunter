const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect database
connectDB();

//Init middleware
app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.send('API running!'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/jobs', require('./routes/api/jobs'));
app.use('/api/contacts', require('./routes/api/contacts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
