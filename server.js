const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '15051999',
        database: 'employee_db',
    },
    console.log('Connected to the employee_db database.')
);

const prompt = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                pageSize: 8,
                message: 'What would you like to do?',
                name: 'action',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit',
                ],
            },
        ])
        .then((answer) => {
            switch (answer.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quit();
                    break;
            }
        });
};

function viewAllEmployees() {
    let sql =
        "SELECT e.id, e.first_name, e.last_Name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.first_name) as manager FROM employee e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id ORDER BY e.id ASC";

    db.query(sql, (error, results) => {
        if (error) {
            console.error(error);
        }
        for (var i = 0; i < results.length; i++) {
            if(results[i]['manager'] == null){
                results[i]['manager'] = "None"
            }
            
        }
        console.table(results);
        prompt();
    });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of the empoyee?',
                name: 'firstName',
            },
            {
                type: 'input',
                message: 'What is the last name of the empoyee?',
                name: 'lastName',
            },
            {
                type: 'input',
                message: "What is the id of the employee's role?",
                name: 'roleId',
            },
            {
                type: 'input',
                message: "What is the id of the employee's manager?",
                name: 'managerId',
            },
        ])
        .then((answers) => {
            let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${answers.roleId}, ${answers.managerId})`;

            db.query(sql, (error, results) => {
                if (error) {
                    console.log(error);
                }
                console.log('The employee has been successfully added!');
                prompt();
            });
        });
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the id of the employee you would like to update?',
                name: 'employeeId',
            },
            {
                type: 'input',
                message: "What is the id of the employee's new role?",
                name: 'roleId',
            },
        ])
        .then((answers) => {
            let sql = `UPDATE employee SET role_id = ${answers.roleId} WHERE id = ${answers.employeeId}`;

            db.query(sql, (error, results) => {
                if (error) {
                    console.error(error);
                }
                console.table(results);
                prompt();
            });
        });
}

function viewAllRoles() {
    let sql = 'SELECT * FROM role';

    db.query(sql, (error, results) => {
        if (error) {
            console.error(error);
        }
        console.table(results);
        prompt();
    });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the title of the role?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            },
            {
                type: 'input',
                message: "What is the id of the role's department?",
                name: 'departmentId',
            },
        ])
        .then((answers) => {
            let sql = `INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${answers.departmentId})`;

            db.query(sql, (error, results) => {
                if (error) {
                    console.error(error);
                }
                console.log('The role has been successfully added!');
                prompt();
            });
        });
}

function viewAllDepartments() {
    let sql = 'SELECT * FROM department';

    db.query(sql, (error, results) => {
        if (error) {
            console.error(error);
        }
        console.table(results);
        prompt();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'name',
            },
        ])
        .then((answers) => {
            let sql = `INSERT INTO department (name) VALUES ("${answers.name}")`;

            db.query(sql, (error, results) => {
                if (error) {
                    console.error(error);
                }
                console.log('The department has been successfully added!');
                prompt();
            });
        });
}

function quit() {
    process.exit(1);
}

prompt();
