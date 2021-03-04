const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const menusRouter = express.Router();

menusRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Menu", (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send({ menus: menus });
    }
  });
});

module.exports = menusRouter;
