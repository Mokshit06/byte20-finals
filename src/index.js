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
const helpRouter = require('./routes/help');
const accountRouter = require('./routes/account');
const driverRouter = require('./routes/driver');
const { ensureDataEntered, ensureAuth } = require('./middleware/auth');

connectToDb();
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.use('/help', ensureAuth, ensureDataEntered, helpRouter);
app.use('/account', ensureAuth, accountRouter);
app.use('/drivers', driverRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
