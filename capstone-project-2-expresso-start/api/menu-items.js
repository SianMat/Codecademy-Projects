const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const menuItemsRouter = express.Router({ mergeParams: true });

//Retrieve all menu items for specified menu
menuItemsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM MenuItem WHERE menu_id=$menuId",
    {
      $menuId: req.menu.id,
    },
    (error, menuItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send({ menuItems: menuItems });
      }
    }
  );
});

//Check fields
const checkParams = (req, res, next) => {
  const name = req.body.menuItem.name;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;
  if (!name || !inventory || !price) {
    return res.status(400).send();
  }
  next();
};

//Add a new menu item
menuItemsRouter.post("/", checkParams, (req, res, next) => {
  db.run(
    "INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)",
    {
      $name: req.body.menuItem.name,
      $description: req.body.menuItem.description,
      $inventory: req.body.menuItem.inventory,
      $price: req.body.menuItem.price,
      $menuId: req.menu.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM MenuItem WHERE id=$id",
          {
            $id: this.lastID,
          },
          (error, menuItem) => {
            res.status(201).send({ menuItem: menuItem });
          }
        );
      }
    }
  );
});

//Get menu item by ID
menuItemsRouter.param("menuItemId", (req, res, next, menuItemId) => {
  db.get(
    "SELECT * FROM MenuItem WHERE id=$id",
    {
      $id: menuItemId,
    },
    (error, menuItem) => {
      if (error) {
        next(error);
      } else if (!menuItem) {
        return res.status(404).send();
      } else {
        req.menuItem = menuItem;
        next();
      }
    }
  );
});

//Update specified menu item
menuItemsRouter.put("/:menuItemId", checkParams, (req, res, next) => {
  db.run(
    "UPDATE MenuItem SET name=$name, description=$description, inventory=$inventory, price=$price WHERE id=$id",
    {
      $name: req.body.menuItem.name,
      $description: req.body.menuItem.description,
      $inventory: req.body.menuItem.inventory || req.menuItem.inventory,
      $price: req.body.menuItem.price,
      $id: req.menuItem.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM MenuItem WHERE id=$id",
          {
            $id: req.menuItem.id,
          },
          (error, menuItem) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send({ menuItem: menuItem });
            }
          }
        );
      }
    }
  );
});

//Delete specified menu item
menuItemsRouter.delete("/:menuItemId", (req, res, next) => {
  db.run(
    "DELETE FROM MenuItem WHERE id=$id",
    {
      $id: req.menuItem.id,
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

module.exports = menuItemsRouter;
