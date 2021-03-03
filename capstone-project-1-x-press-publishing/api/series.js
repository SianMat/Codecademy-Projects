const express = require("express");
const sqlite3 = require("sqlite3");
const issuesRouter = require("./issues");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const seriesRouter = express.Router();

//retrieve all series
seriesRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Series", (error, series) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send({ series: series });
    }
  });
});

//get series by id
seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  db.get(
    "SELECT * FROM Series WHERE id=$id",
    {
      $id: seriesId,
    },
    (error, series) => {
      if (error) {
        next(error);
      } else if (series) {
        req.series = series;
        next();
      } else {
        return res.status(404).send();
      }
    }
  );
});

seriesRouter.use("/:seriesId/issues", issuesRouter);

//retrieve specified series
seriesRouter.get("/:seriesId", (req, res, next) => {
  res.status(200).send({ series: req.series });
});

//add a new series
seriesRouter.post("/", (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  if (!name || !description) {
    return res.status(400).send();
  } else {
    db.run(
      "INSERT INTO Series (name, description) VALUES ($name, $description)",
      {
        $name: name,
        $description: description,
      },
      function (error) {
        if (error) {
          next(error);
        } else {
          db.get(
            "SELECT * FROM Series WHERE id=$id",
            {
              $id: this.lastID,
            },
            (error, series) => {
              res.status(201).send({ series: series });
            }
          );
        }
      }
    );
  }
});

//update a specified series
seriesRouter.put("/:seriesId", (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  if (!name || !description) {
    return res.status(400).send();
  } else {
    db.run(
      "UPDATE Series SET name=$name, description=$description WHERE id=$id",
      {
        $id: req.series.id,
        $name: name,
        $description: description,
      },
      function (error) {
        if (error) {
          next(error);
        } else {
          db.get(
            "SELECT * FROM Series WHERE id=$id",
            {
              $id: req.series.id,
            },
            (error, series) => {
              res.status(200).send({ series: series });
            }
          );
        }
      }
    );
  }
});

seriesRouter.delete("/:seriesId", (req, res, next) => {
  db.get(
    "SELECT * FROM Issue WHERE series_id=$seriesId",
    {
      $seriesId: req.series.id,
    },
    (error, issue) => {
      if (error) {
        next(error);
      } else if (issue) {
        res.status(400).send();
      } else {
        db.run(
          "DELETE FROM Series WHERE id=$id",
          {
            $id: req.series.id,
          },
          (error) => {
            if (error) {
              next(error);
            } else {
              res.status(204).send();
            }
          }
        );
      }
    }
  );
});

module.exports = seriesRouter;
