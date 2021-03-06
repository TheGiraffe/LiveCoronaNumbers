const express = require("express");

const app = express();

const hbs = require("hbs");

const path = require("path");

const fetch = require("node-fetch");

var count=0;

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerPartials(__dirname + "/partials");

app.get("/", async (req, res) => {
    count++;
  await fetch("https://corona.lmao.ninja/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        
      var d = new Date(); // for now
      d.getHours(); //  hours
      d.getMinutes(); // minutes
      d.getSeconds();

      var x = data.recovered + data.deaths;

      res.render("home", { data, d, x ,count});
    })
    .catch((err) => {
      // Do something for an error here
      console.log(err);
    });
});

app.get("/care", async (req, res) => {
  await fetch("https://api.covid19india.org/website_data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      var st = data.factoids;
      res.render("things", { st });
    })
    .catch((err) => {});
});
app.get("/faq", async (req, res) => {
  await fetch("https://api.covid19india.org/website_data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      var st = data.faq;
      //console.log(st);

      res.render("faq", { st });
    })
    .catch((err) => {});
});
app.get("/India", async (req, res) => {
    await fetch("https://api.covid19india.org/data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var d = new Date();
      //console.log(data.statewise[0]);
      var st = data.statewise;
      // console.log(st);

      res.render("india", { st, d });
    })
    .catch((err) => {});
});

app.get("/yesterday", async (req, res) => {
  await fetch("https://corona.lmao.ninja/v2/all?yesterday=true")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var d = new Date(); // Today!
      d.setDate(d.getDate() - 1);
      var x = data.recovered + data.deaths;
      res.render("Yeshome", { data, d, x });
    })
    .catch((err) => {
      // Do something for an error here
    });
});
app.get("/countryWise", async (req, res) => {
  await fetch("https://corona.lmao.ninja/v2/countries?sort=cases")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.render("countryWise", { data: data });
    })
    .catch((err) => {
      // Do something for an error here
    });
});
app.get("/countryWiseYesterday", async (req, res) => {
  await fetch("https://corona.lmao.ninja/v2/countries?yesterday=true&sort=cases")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.render("countryYesterday", { data: data });
    })
    .catch((err) => {
      // Do something for an error here
    });
});
app.get("/USAstates", async (req, res) => {
    await fetch("https://corona.lmao.ninja/v2/states")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.sort((a, b) => parseFloat(b.cases) - parseFloat(a.cases));
      res.render("stateWise", { data: data });
    })
    .catch((err) => {
      // Do something for an error here
    });
});

app.listen(process.env.PORT || 3000, process.env.IP);
