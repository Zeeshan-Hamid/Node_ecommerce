const Product = require('../models/product');
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find({})
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      let products = user.cart.items.map((item) => ({
        ...item.productId._doc,
        quantity: item.quantity,
      }));
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};



exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = parseInt(req.body.quantity, 10); // Get the quantity from the form and parse it as an integer
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product, quantity);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("Product ID from request:", prodId);

  if (!prodId) {
    console.error("No product ID provided");
    return res.status(400).send("Product ID is required");
  }

  if (!req.user) {
    console.error("No user found in request");
    return res.status(401).send("User not authenticated");
  }

  req.user
    .removeFromCart(prodId)
    .then((result) => {
      console.log("Product removed from cart successfully");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.error("Error removing product from cart:", err);
      next(err); // Pass error to next middleware
    });
};


exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      const total = products.reduce((sum, item) => {
        console.log(
          `Product: ${item.product.title}, Quantity: ${item.quantity}, Price: ${item.product.price}`
        );
        return sum + item.product.price * item.quantity;
      }, 0);

      console.log(`Total: ${total}`);

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
        total: total,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};



exports.getOrders = (req, res, next) => {

  Order.find({"user.userId": req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
       
      });
    })
    .catch(err => console.log(err));
};
