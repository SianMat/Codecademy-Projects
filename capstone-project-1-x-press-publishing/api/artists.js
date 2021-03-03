const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const artistsRouter = express.Router();

//retrieve all artists
artistsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE is_currently_employed = 1",
    (err, artists) => {
      if (err) {
        next(err);
      } else {
        res.status(200).send({ artists: artists });
      }
    }
  );
});

//add a new artist
artistsRouter.post("/", (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;
  const employed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  if (!name || !dateOfBirth || !biography) {
    return res.status(400).send();
  }
  db.run(
    "INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $employed)",
    {
      $name: name,
      $dateOfBirth: dateOfBirth,
      $biography: biography,
      $employed: employed,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Artist WHERE id=$id",
          {
            $id: this.lastID,
          },
          (error, artist) => {
            res.status(201).send({ artist: artist });
          }
        );
      }
    }
  );
});

//get artist by id
artistsRouter.param("artistId", (req, res, next, artistId) => {
  db.get(
    "SELECT * FROM Artist WHERE id=$artistId",
    {
      $artistId: artistId,
    },
    (error, artist) => {
      if (error) {
        next(error);
      } else if (artist) {
        req.artist = artist;
        next();
      } else {
        res.status(404).send();
      }
    }
  );
});

//retrieve specified artist
artistsRouter.get("/:artistId", (req, res, next) => {
  res.status(200).send({ artist: req.artist });
});

//update specified artist
artistsRouter.put("/:artistId", (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;
  const employed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  if (!name || !dateOfBirth || !biography) {
    return res.status(400).send();
  }
  db.run(
    "UPDATE Artist SET name=$name, date_of_birth=$dateOfBirth, biography=$biography, is_currently_employed=$employed WHERE id=$id",
    {
      $name: name,
      $dateOfBirth: dateOfBirth,
      $biography: biography,
      $employed: employed,
      $id: req.artist.id,
    },
    function (error) {
      if (error) {
        next(error);
      }
      db.get(
        "SELECT * FROM Artist WHERE id=$id",
        {
          $id: req.artist.id,
        },
        (error, artist) => {
          res.status(200).send({ artist: artist });
        }
      );
    }
  );
});

//delete an artist
artistsRouter.delete("/:artistId", (req, res, next) => {
  db.run(
    "UPDATE Artist SET is_currently_employed=0 WHERE id=$id",
    {
      $id: req.artist.id,
    },
    (error) => {
      if (error) {
        next(error);
      }
      db.get(
        "SELECT * FROM Artist WHERE id=$id",
        {
          $id: req.artist.id,
        },
        (error, artist) => {
          res.status(200).json({ artist: artist });
        }
      );
    }
  );
});

module.exports = artistsRouter;
