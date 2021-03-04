const express = require("express");
const sqlite3 = require("sqlite3");
const timesheetsRouter = require("./timesheets");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const employeesRouter = express.Router();
employeesRouter.use("/:employeeId/timesheets", timesheetsRouter);

//Retrieve all employees
employeesRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Employee WHERE is_current_employee=1",
    (error, employees) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send({ employees: employees });
      }
    }
  );
});

//check all required fields
const checkFields = (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;
  if (!name || !position || !wage) {
    return res.status(400).send();
  }
  next();
};

//Add a new employee
employeesRouter.post("/", checkFields, (req, res, next) => {
  db.run(
    "INSERT INTO Employee (name, position, wage) VALUES ($name, $position, $wage)",
    {
      $name: req.body.employee.name,
      $position: req.body.employee.position,
      $wage: req.body.employee.wage,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Employee WHERE id=$id",
          {
            $id: this.lastID,
          },
          (error, employee) => {
            if (error) {
              next(error);
            } else {
              return res.status(201).send({ employee: employee });
            }
          }
        );
      }
    }
  );
});

//Get employee by ID
employeesRouter.param("employeeId", (req, res, next, id) => {
  db.get(
    "SELECT * FROM Employee WHERE id=$id",
    {
      $id: id,
    },
    (error, employee) => {
      if (error) {
        next(error);
      } else if (!employee) {
        return res.status(404).send();
      } else {
        req.employee = employee;
        next();
      }
    }
  );
});

//Retrieve specified employee
employeesRouter.get("/:employeeId", (req, res, next) => {
  res.status(200).send({ employee: req.employee });
});

//update specified employee
employeesRouter.put("/:employeeId", checkFields, (req, res, next) => {
  db.run(
    "UPDATE Employee SET name=$name, position=$position, wage=$wage WHERE id=$id",
    {
      $name: req.body.employee.name,
      $position: req.body.employee.position,
      $wage: req.body.employee.wage,
      $id: req.employee.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Employee WHERE id=$id",
          {
            $id: req.employee.id,
          },
          (error, employee) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send({ employee: employee });
            }
          }
        );
      }
    }
  );
});

//delete specified employee
employeesRouter.delete("/:employeeId", (req, res, next) => {
  db.run(
    "UPDATE Employee SET is_current_employee=0 WHERE id=$id",
    {
      $id: req.employee.id,
    },
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          "SELECT * FROM Employee WHERE id=$id",
          {
            $id: req.employee.id,
          },
          (error, employee) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send({ employee: employee });
            }
          }
        );
      }
    }
  );
});

module.exports = employeesRouter;
