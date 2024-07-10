const path = require('path');
const mongoose = require('mongoose')

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("668d5a45a77bf6b93329ea05")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(
  "mongodb+srv://zeeshanhamid17:$zee03052002@cluster0.3fhdcu9.mongodb.net/newShop?retryWrites=true&w=majority&appName=Cluster0"
).then(result => {
  User.findOne().then(user => {
    if (!user) {
      user = new User({
        name: "Zeeshan",
        email: "zeeshanhamid17@gmail.com",
        cart: {
          items: [],
        },
      });
    }
         
  })
  console.log("connected")
  app.listen(3000);
});
