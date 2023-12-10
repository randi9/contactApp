const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  dupCheck,
  deleteContact,
  updateContact,
} = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.get("/", (req, res, next) => {
  
  res.status(200);
  
  const Mahasiswa = [
    {
      name: "ahmad",
      email: "ahmd@gmail.com",
    },
    {
      name: "uus",
      email: "uus@gmail.com",
    },
  ];
  res.render("index", {
    name: "Sans",
    title: "Home",
    layout: "layouts/main-layout",
    Mahasiswa: Mahasiswa,
  });
});

app.get("/about", (req, res, next) => {
  res.status(200);
  res.render("about", {
    layout: "layouts/main-layout",
    title: "About",
  });
  // res.sendFile("./about.html", { root: __dirname });
});

app.get("/contact", (req, res, next) => {
  // res.send("<h1>Ini adalah halaman Contact</h1>");
  res.status(200);
  const contacts = loadContact();
  console.log(contacts);
  // res.sendFile("./contact.html", { root: __dirname });
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.status(200);
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Add New Contact",
  });
});

app.post(
  "/contact",
  [
    check("email", "Invalid Email").isEmail(),
    check("nohp", "Invalid Phone Number").isMobilePhone("id-ID"),
    body("name").custom((value) => {
      const duplikat = dupCheck(value);
      if (duplikat) {
        throw new Error("Contact Already Exist!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        layout: "layouts/main-layout",
        title: "Add New Contact",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash("msg", "Contact Successfully Added!");
      res.status(200);
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:name", (req, res) => {
  const contact = findContact(req.params.name);
  if (!contact) {
    res.status(404);
    res.send("404");
  } else {
    deleteContact(req.params.name);
    req.flash("msg", "Contact Deleted!");
    res.status(200);
    res.redirect("/contact");
  }
});

app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.status(200);
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact,
  });
});

app.post(
  "/contact/update",
  [
    check("email", "Invalid Email").isEmail(),
    check("nohp", "Invalid Phone Number").isMobilePhone("id-ID"),
    body("name").custom((value, { req }) => {
      const duplikat = dupCheck(value);
      if (value !== req.body.oldname && duplikat) {
        throw new Error("Contact Already Exist!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        layout: "layouts/main-layout",
        title: "Edit Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);
      req.flash("msg", "Contact Edited!");
      res.status(200);
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:name", (req, res, next) => {
  // res.send("<h1>Ini adalah halaman Contact</h1>");
  res.status(200);
  const contact = findContact(req.params.name);
  console.log(contact);
  // res.sendFile("./contact.html", { root: __dirname });
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Contact Details",
    contact,
  });
});

app.get("/product", (req, res) => {
  res.send(`Label Product: ${req.query.label}`);
});

app.get("/product/:id", (req, res) => {
  res.send("Product ID: " + req.params.id);
});

app.get("/product/:id/category/:idCat", (req, res) => {
  res.send(`Product ID: ${req.params.id} and Category ID: ${req.params.idCat}`);
});

app.use("/", (req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
