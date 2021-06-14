const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const usePassport = require('./config/passport')
const db = require('./models')
const User = db.User
const Todo = db.Todo

const app = express()
const port = 3000


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { res.render('index', { todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => {
      return res.render('detail', { todo: todo.toJSON() })
    })
    .catch(error => console.log(error))
})
app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('User already exists')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => { return bcrypt.hash(password, salt) })
        .then(hash => {
          return User.create({
            name,
            email,
            password: hash
          })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})