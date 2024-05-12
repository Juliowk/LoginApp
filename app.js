const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = 8081;

const operations = require("./routes/operations");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/LoginApp")
     .then(() => {
          console.log("Conectado ao mongo!");
     })
     .catch((error) => {
          console.log("Erro ao se conectar ao mongo: " + error); 
     });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine({
     defaultLayout: 'main',
     runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
     }
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
     secret: "qualquercoisa",
     resave: true,
     saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
     res.locals.success_msg = req.flash("success_msg");
     res.locals.error_msg = req.flash("error_msg");
     next();
});

app.get("/", (req, res) => {
     res.render("operationsPage/login");
});

app.get("/register", (req, res) => {
     res.render("operationsPage/register");
});

app.use("/operations", operations);

app.listen(PORT, () => { console.log(`Rodando na url: https://localhost:${PORT}`); });