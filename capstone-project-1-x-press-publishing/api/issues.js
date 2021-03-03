const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const issuesRouter = express.Router({ mergeParams: true });

//retrieve issues for given series
issuesRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Issue WHERE Issue.series_id=$seriesId",
    {
      $seriesId: req.series.id,
    },
    (error, issues) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send({ issues: issues });
      }
    }
  );
});

const checkParams = (req, res, next) => {
  const values = {
    name: req.body.issue.name,
    issueNumber: req.body.issue.issueNumber,
    publicationDate: req.body.issue.publicationDate,
    artistId: req.body.issue.artistId,
  };
  if (
    !values.name ||
    !values.issueNumber ||
    !values.publicationDate ||
    !values.artistId
  ) {
    return res.status(400).send();
  } else {
    db.get(
      "SELECT * FROM Artist WHERE Artist.id=$artistId",
      {
        $artistId: values.artistId,
      },
      (error, artist) => {
        if (error) {
          next(error);
        } else if (!artist) {
          return res.status(400).send();
        } else {
          req.values = values;
          next();
        }
      }
    );
  }
};
//add a new issue
issuesRouter.post("/", checkParams, (req, res, next) => {
  db.run(
    "INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)",
    {
      $name: req.values.name,
      $issueNumber: req.values.issueNumber,
      $publicationDate: req.values.publicationDate,
      $artistId: req.values.artistId,
      $seriesId: req.series.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Issue WHERE id=$id",
          {
            $id: this.lastID,
          },
          (error, issue) => {
            if (error) {
              next(error);
            } else {
              res.status(201).send({ issue: issue });
            }
          }
        );
      }
    }
  );
});

//get issue by id
issuesRouter.param("issueId", (req, res, next, issueId) => {
  db.get(
    "SELECT * FROM Issue WHERE id=$id",
    {
      $id: issueId,
    },
    (error, issue) => {
      if (error) {
        next(error);
      } else if (issue) {
        req.issue = issue;
        next();
      } else {
        return res.status(404).send();
      }
    }
  );
});

//update issue
issuesRouter.put("/:issueId", checkParams, (req, res, next) => {
  db.run(
    "UPDATE Issue SET name=$name, issue_number=$issueNumber, publication_date=$publicationDate, artist_id=$artistId WHERE id=$issueId",
    {
      $name: req.values.name,
      $issueNumber: req.values.issueNumber,
      $publicationDate: req.values.publicationDate,
      $artistId: req.values.artistId,
      $issueId: req.issue.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Issue WHERE id=$id",
          {
            $id: req.issue.id,
          },
          (error, issue) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send({ issue: issue });
            }
          }
        );
      }
    }
  );
});

//delete specified issue
issuesRouter.delete("/:issueId", (req, res, next) => {
  db.run(
    "DELETE FROM Issue WHERE id=$id",
    {
      $id: req.issue.id,
    },
    (error) => {
      if (error) {
        next(error);
      } else {
        res.status(204).send();
      }
    }
  );
});

module.exports = issuesRouter;
