const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();
const { deptAdd, roleAdd, employeeAdd, updateEmployee } = require("../prompts/userPrompts");

// create MySQL connection pool using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to fetch all roles from the database
async function getRolesFromDatabase() {
    try {
        const query = "SELECT * FROM roles";
        const [roles] = await db.promise().query(query);
        return roles;
    } catch (err) {
        console.error("Error in getRolesFromDatabase:", err);
        return [];
    }
};

async function getManagersFromDatabase() {
    try {
        const query = "SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees";
        const [employees] = await db.promise().query(query);

        const managerChoices = [{ name: "None", value: null }, ...employees.map(manager => ({ name: manager.manager_name, value: manager.id}))];
        
        return managerChoices;
    } catch (err) {
        console.error("Error in getManagersFromDatabase:", err);
        return [];
    }
};

async function getEmployeesFromDatabase() {
    try {
        // SQL query to select all employees
        const query = "SELECT * FROM employees";

        // Execute query
        const [employees] = await db.promise().query(query);

        return employees;
    } catch (err) {
        console.error("Error in getEmployeesFromDatabase:", err);
        return [];
    }
};

// Function to view all departments
async function viewAllDepartments() {
  try {
    // Your SQL query to select all departments
    const query = "SELECT * FROM departments";

    // Execute the query
    const [departments] = await db.promise().query(query);

    // Log the result or format it as needed
    console.table(departments);

  } catch (error) {
    console.error("Error in viewAllDepartments:", error);
  }
};

async function viewAllRoles() {
    try {
        // SQL query to select all departments
        const query = `
            SELECT roles.id, roles.role_title, roles.role_salary, departments.dept_name
            FROM roles
            JOIN departments ON roles.dept_id = departments.id`;

        // execute query
        const [roles] = await db.promise().query(query);

        console.table(roles);
        
    } catch (err) {
        console.error("Error in viewAllRoles:", err)
    }
};

async function viewAllEmployees() {
    try {
        //SQL query to select all employees
        const query = `
            SELECT
                employees.id AS ID,
                employees.first_name AS First_Name,
                employees.last_name AS Last_Name,
                roles.role_title AS Title,
                departments.dept_name AS Department,
                roles.role_salary AS Salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
            FROM
                employees
            JOIN
                roles ON employees.role_id = roles.id
            JOIN
                departments ON roles.dept_id = departments.id
            LEFT JOIN
                employees AS manager ON employees.manager_id = manager.id`;

        // execute query
        const [employees] = await db.promise().query(query);

        console.table(employees);

    } catch (err) {
        console.error("Error in viewAllEmployees:", err)
    }
};

async function addDepartment() {
    try {
        // Prompt user for dept name
        const { newDepartmentName } = await inquirer.prompt(deptAdd);

        // SQL query to insert a new dept
        const query = "INSERT INTO departments (dept_name) VALUES (?)";

        await db.promise().execute(query, [newDepartmentName]);

        console.log(`Department ${newDepartmentName} added to the database successfully!`);
    } catch (err) {
        console.error("Error in addDepartment:", err)
    }
};

async function addRole() {
    try {
        // Fetch existing departments from the database
        const [departments] = await db.promise().query("SELECT id, dept_name FROM departments");

        // Map departments choices for inquirer prompt
        const departmentChoices = departments.map(departments => ({
            name: departments.dept_name,
            value: departments.id,
        }));

        // Prompt user for role details and department choice
        const { newRoleName, newRoleSalary, departmentId } = await inquirer.prompt([
            roleAdd[0],
            roleAdd[1],
            {
                ...roleAdd[2],
                choices: departmentChoices,
            },
        ]);

        // SQL query to insert new role
        const query = "INSERT INTO roles (role_title, role_salary, dept_id) VALUES (?, ?, ?)";

        await db.promise().execute(query, [newRoleName, newRoleSalary, departmentId]);

        console.log(`Role ${newRoleName} added to the database successfully!`)
    } catch (err) {
        console.error("Error in addRole:", err);
    }
};

async function addEmployee() {
    try {
        // Fetch role choices from database
        const roles = await getRolesFromDatabase();
        // Map the roles to choices  for the inquirer prompt
        const roleChoices = roles.map(role => ({ name: role.role_title, value: role.id }));

        // Fet employee names from the database
        const managers = await getManagersFromDatabase();
        // Map the names to choices for inquirer prompt
        const managerChoices = managers.map(manager => ({ name: manager.name, value: manager.value }));

        // Prompt user for employee details
        const {firstName, lastName, empRole, empMan } = await inquirer.prompt([
            ...employeeAdd.slice(0, 2),
            {
                ...employeeAdd[2],
                choices: roleChoices,
            },
            {
                ...employeeAdd[3],
                choices: managerChoices,
            },
        ]);

        // SQL query to post new employee
        const query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

        // Execute query
        await db.promise().execute(query, [firstName, lastName, empRole, empMan])

        console.log(`Employee ${firstName} ${lastName} added to the database successfully!`)
    } catch (err) {
        console.error("Error in addEmployee:", err);
    }
};

async function updateEmployeeRole() {
    try {
        const employees = await getEmployeesFromDatabase();
        const roles = await getRolesFromDatabase();

        // Map employees and roles to choices for inquirer
        const employeeChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
        const roleChoices = roles.map(role => ({ name: role.role_title, value: role.id }));

        // Update choices in updateEmployee prompts
        updateEmployee[0].choices =  employeeChoices;
        updateEmployee[1].choices = roleChoices;

        // Prompt user for employee and role details
        const { updEmp, updRole } = await inquirer.prompt(updateEmployee);

        // SQL query to update
        const query = "UPDATE employees SET role_id = ? WHERE id = ?";

        // Execute query
        await db.promise().execute(query, [updRole, updEmp]);

        console.log("Employee's role updated to the database successfully!");
    } catch (err) {
        console.error("Error in updateEmployeeRole:", err);
    }
};


// Don't forget to export your functions
module.exports = {
  db, viewAllDepartments, viewAllRoles, 
  viewAllEmployees, addDepartment, 
  addRole, addEmployee, 
  updateEmployeeRole
};