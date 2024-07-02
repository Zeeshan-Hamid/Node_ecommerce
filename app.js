const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require('./models/cart')
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { constants } = require("buffer");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findOne({ where: { id: 1 } })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constants: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, {through: CartItem})

sequelize
  //.sync({ force: true }) //force: true because we just override the tables with association and we have to force them. Otherwise in production we dont need to do that
  .sync()
  .then((result) => {
    return User.findOne({ where: { id: 1 } });
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Zeeshan", email: "zee@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    //console.log(user);
    return user.createCart();
    
  }).then(cart => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
