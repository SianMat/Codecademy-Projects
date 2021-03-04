const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const timesheetsRouter = express.Router({ mergeParams: true });

//Retrieve all timesheets for specified employee
timesheetsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Timesheet WHERE employee_id=$employeeId",
    {
      $employeeId: req.employee.id,
    },
    (error, timesheets) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send({ timesheets: timesheets });
      }
    }
  );
});

//check fields
const checkParams = (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  if (!hours || !rate || !date) {
    return res.status(400).send();
  }
  next();
};

//Add a new timesheet for specified employee
timesheetsRouter.post("/", checkParams, (req, res, next) => {
  db.run(
    "INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)",
    {
      $hours: req.body.timesheet.hours,
      $rate: req.body.timesheet.rate,
      $date: req.body.timesheet.date,
      $employeeId: req.employee.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Timesheet WHERE id=$id",
          {
            $id: this.lastID,
          },
          (error, timesheet) => {
            if (error) {
              next(error);
            } else {
              res.status(201).send({ timesheet: timesheet });
            }
          }
        );
      }
    }
  );
});

//Get timesheet by ID
timesheetsRouter.param("timesheetId", (req, res, next, timesheetId) => {
  db.get(
    "SELECT * FROM Timesheet WHERE id=$id",
    {
      $id: timesheetId,
    },
    (error, timesheet) => {
      if (error) {
        next(error);
      } else if (!timesheet) {
        res.status(404).send();
      } else {
        req.timesheet = timesheet;
        next();
      }
    }
  );
});

//Update the specified timesheet
timesheetsRouter.put("/:timesheetId", checkParams, (req, res, next) => {
  db.run(
    "UPDATE Timesheet SET hours=$hours, date=$date, rate=$rate WHERE id=$id",
    {
      $hours: req.body.timesheet.hours,
      $rate: req.body.timesheet.rate,
      $date: req.body.timesheet.date,
      $id: req.timesheet.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Timesheet WHERE id=$id",
          {
            $id: req.timesheet.id,
          },
          (error, timesheet) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send({ timesheet: timesheet });
            }
          }
        );
      }
    }
  );
});

timesheetsRouter.delete("/:timesheetId", (req, res, next) => {
  db.run(
    "DELETE FROM Timesheet WHERE id=$id",
    {
      $id: req.timesheet.id,
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

module.exports = timesheetsRouter;
