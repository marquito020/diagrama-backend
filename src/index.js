const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
// const validator = require('express-validator');

const MySQLStore = require('express-mysql-session');
const passport = require('passport');
// const bodyParser = require('body-parser');
//  const { engine } = require('express-handlebars');
const app = express();
require('./lib/passport');

const { database } = require('./keys');

// Settings

app.set('port', process.env.PORT || 5000);

//__dirname es una constantes que me devuelve la direccion de la carpeta
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partitials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'msm',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(validator());


// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  //  app.locals.idSALA = req.
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/apis', require('./routes/apis'));
app.use('/salas', require('./routes/salas'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});