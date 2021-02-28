const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const boss = require("./server/db");
const checkMillionDollarIdea = require("./server/checkMillionDollarIdea");

module.exports = app;

/* Do not change the following line! It is required for testing and allowing
 *  the frontend application to interact as planned with the api server
 */
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require("./server/api");
app.use("/api", apiRouter);

// This conditional is here for testing purposes:
if (!module.parent) {
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
}

//get minion
app.param("minionId", (req, res, next, minionId) => {
  const minion = boss.getFromDatabaseById("minions", minionId);
  if (minion) {
    req.minion = minion;
    next();
  } else {
    res.status(404).send();
  }
});

//app/minions
app.get("/api/minions", (req, res, next) => {
  res.send(boss.getAllFromDatabase("minions"));
});

app.get("/api/minions/:minionId", (req, res, next) => {
  res.send(req.minion);
});

app.put("/api/minions/:minionId", (req, res, next) => {
  res.send(boss.updateInstanceInDatabase("minions", req.body));
});

app.post("/api/minions", (req, res, next) => {
  res.status(201).send(boss.addToDatabase("minions", req.body));
});

app.delete("/api/minions/:minionId", (req, res, next) => {
  res.status(204).send(boss.deleteFromDatabasebyId("minions", req.minion.id));
});

//get idea
app.param("ideaId", (req, res, next, ideaId) => {
  const idea = boss.getFromDatabaseById("ideas", ideaId);
  if (idea) {
    req.idea = idea;
    next();
  } else {
    res.status(404).send();
  }
});

//app/ideas
app.get("/api/ideas", (req, res, next) => {
  res.send(boss.getAllFromDatabase("ideas"));
});

app.get("/api/ideas/:ideaId", (req, res, next) => {
  res.send(req.idea);
});

app.put("/api/ideas/:ideaId", (req, res, next) => {
  res.send(boss.updateInstanceInDatabase("ideas", req.body));
});

app.post("/api/ideas", checkMillionDollarIdea, (req, res, next) => {
  res.status(201).send(boss.addToDatabase("ideas", req.body));
});

app.delete("/api/ideas/:ideaId", (req, res, next) => {
  res.status(204).send(boss.deleteFromDatabasebyId("ideas", req.idea.id));
});

//api/meetings
app.get("/api/meetings", (req, res, next) => {
  res.send(boss.getAllFromDatabase("meetings"));
});

app.post("/api/meetings", (req, res, next) => {
  const newMeeting = boss.createMeeting();
  res.status(201).send(boss.addToDatabase("meetings", newMeeting));
});

app.delete("/api/meetings", (req, res, next) => {
  res.status(204).send(boss.deleteAllFromDatabase("meetings"));
});

//get work
app.param("workId", (req, res, next, workId) => {
  const work = boss.getFromDatabaseById("work", workId);
  if (work) {
    if (req.minion.id === work.minionId) {
      req.work = work;
      next();
    } else {
      res.status(400).send();
    }
  } else {
    res.status(404).send();
  }
});

//BONUS
app.get("/api/minions/:minionId/work", (req, res, next) => {
  const allWork = boss.getAllFromDatabase("work");
  const minionWork = [];
  for (const work in allWork) {
    if (allWork[work].minionId === req.minion.id) {
      minionWork.push(allWork[work]);
    }
  }
  res.send(minionWork);
});

app.put("/api/minions/:minionId/work/:workId", (req, res, next) => {
  res.send(boss.updateInstanceInDatabase("work", req.body));
});

app.post("/api/minions/:minionId/work", (req, res, next) => {
  res.status(201).send(boss.addToDatabase("work", req.body));
});

app.delete("/api/minions/:minionId/work/:workId", (req, res, next) => {
  res.status(204).send(boss.deleteFromDatabasebyId("work", req.work.id));
});
