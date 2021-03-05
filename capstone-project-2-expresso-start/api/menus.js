const express = require("express");
const sqlite3 = require("sqlite3");
const menuItemsRouter = require("./menu-items");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const menusRouter = express.Router();
menusRouter.use("/:menuId/menu-items", menuItemsRouter);

menusRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Menu", (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send({ menus: menus });
    }
  });
});

//Check fields
const checkParams = (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    return res.status(400).send();
  }
  next();
};

//Add a new menu
menusRouter.post("/", checkParams, (req, res, next) => {
  db.run(
    "INSERT INTO Menu (title) VALUES ($title)",
    {
      $title: req.body.menu.title,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Menu WHERE id=$id",
          {
            $id: this.lastID,
          },
          (error, menu) => {
            if (error) {
              next(error);
            } else {
              res.status(201).send({ menu: menu });
            }
          }
        );
      }
    }
  );
});

//Get menu by ID
menusRouter.param("menuId", (req, res, next, menuId) => {
  db.get(
    "SELECT * FROM Menu WHERE id=$id",
    {
      $id: menuId,
    },
    (error, menu) => {
      if (error) {
        next(error);
      } else if (!menu) {
        return res.status(404).send();
      } else {
        req.menu = menu;
        next();
      }
    }
  );
});

//Retrieve specified menu
menusRouter.get("/:menuId", (req, res, next) => {
  res.status(200).send({ menu: req.menu });
});

//Update specified menu
menusRouter.put("/:menuId", checkParams, (req, res, next) => {
  db.run(
    "UPDATE Menu SET title=$title WHERE id=$id",
    {
      $id: req.menu.id,
      $title: req.body.menu.title,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Menu WHERE id=$id",
          {
            $id: req.menu.id,
          },
          (error, menu) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send({ menu: menu });
            }
          }
        );
      }
    }
  );
});

const checkForMenuItems = (req, res, next) => {
  db.get(
    "SELECT * FROM MenuItem WHERE menu_id=$menuId",
    {
      $menuId: req.menu.id,
    },
    (error, menu) => {
      if (error) {
        next(error);
      } else {
        if (menu) {
          return res.status(400).send();
        }
        next();
      }
    }
  );
};

//delete specified menu
menusRouter.delete("/:menuId", checkForMenuItems, (req, res, next) => {
  db.run(
    "DELETE FROM Menu WHERE id=$id",
    {
      $id: req.menu.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        res.status(204).send();
      }
    }
  );
});

module.exports = menusRouter;
