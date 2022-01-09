const inquirer = require('inquirer');
require('dotenv').config()
const db = require("./db/connection")


db.connect(err => {
    if(err) throw err;
});

 
  


init()

function init(){
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                "View All Employees", 
                "View All Roles", 
                "View All Departments", 
                "Add Department", 
                "Add Role", 
                "Add Employee", 
                "Update Employee"
            ]
        }
    ]).then(response =>{
        let userChoice = response.choice;
        switch( userChoice ) {
            case "View All Employees":
            viewEmployees();
            break;
            case "View All Roles":
            viewRoles();
            break;
            case "View All Departments":
            viewDepartments();
            break;
            case "Add Department":
            createDepartment();
            break;
            case 'Add Role':
            createRole();
            break;
            case 'Add Employee':
            createEmployee();
            break;
            case "Update Employee":
            updateEmployee();
            break;
            
        
        }
    })
}

// display all employees
viewEmployees = () => {
    
    console.log('Showing all employees...\n'); 
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        roles.title, 
                        department.name AS department,
                        roles.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employee
                        LEFT JOIN roles ON employee.roles_id = roles.id
                        LEFT JOIN department ON roles.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      init();
    });
  };

  // function to sneak peak at those roles ;) 
viewRoles = () => {
    console.log('Showing all roles...\n');
  
    const sql = `SELECT * FROM roles`;
    
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      init();
    })
  };

  // function to peak at the departments 
viewDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT * FROM department`; 
  
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      init();
    });
  };

  // function to create and add a department to the table
createDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDepo',
        message: "What department do you want to add?",
        validate: addDepo => {
          if (addDepo) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, answer.addDepo, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDepo + " to departments!"); 
  
          viewDepartments();
      });
    });
  };

  // function to create and add a role to table
createRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'roles',
        message: "What kind of roole would you like to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if (addSalary) {
              return true;
          } else {
              console.log('Please enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.roles, answer.salary];
  
        
        const roleSql = `SELECT name, id FROM department`; 
  
        db.query(roleSql, (err, data) => {
          if (err) throw err; 
            // tutor helped with this one thank god
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO roles (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.roles + " to roles!"); 
  
                viewRoles();
         });
       });
     });
   });
  };

  // function to add an employee 
createEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.firstName, answer.lastName]
  
      // grab roles from roles table
      const roleSql = `SELECT roles.id, roles.title FROM roles`;
    
      db.query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                db.query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      db.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
  
                      viewEmployees();
                });
              });
            });
          });
       });
    });
  };

  // function to update an employee 
updateEmployee = () => {
    
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
        // prompt asking which empolyee
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM roles`;
  
          db.query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
  
                  const sql = `UPDATE employee SET roles_id = ? WHERE id = ?`;
  
                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log(`You've updated your desired employee`);
                
                  viewEmployees();
            });
          });
        });
      });
    });
  };
  