const path = require('path');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const { connection } = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const connectToDb = require('../config/mongoose');
const initializePassport = require('../config/passport');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const helpRouter = require('./routes/help');
const accountRouter = require('./routes/account');
const { ensureDataEntered, ensureAuth } = require('./middleware/auth');

connectToDb();
initializePassport(passport);

app.use(express.json());

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: connection,
    }),
    secret: 'qwerty',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/help', ensureDataEntered, helpRouter);
app.use('/account', ensureAuth, accountRouter);

const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log(`Server running on ${PORT}`));
