const options = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      {name: "View All Departments", value: 1},
      {name: "View All Roles", value: 2},
      {name: "View All Employees", value: 3},
      {name: "Add a Department", value: 4},
      {name: "Add a Role", value: 5},
      {name: "Add an employee", value: 6},
      {name: "Update an employee role", value: 7},
      {name: "Quit", value: 8},
    ],
    name: "userChoice",
  },
];

const deptAdd = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "newDepartmentName",
  },
];

const roleAdd = [
  {
    type: "input",
    message: "What is the name of the role?",
    name: "newRoleName",
  },
  {
    type: "input",
    message: "What is the salary of the role?",
    name: "newRoleSalary",
  },
  {
    type: "list",
    message: "Which department does the role belong to?",
    name: "departmentId",
  },
];

const employeeAdd = [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "firstName",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "lastName",
  },
  {
    type: "list",
    message: "What is the employee's role?",
    name: "empRole",
    choices: [],
  },
  {
    type: "list",
    message: "Who is the employee's manager?",
    name: "empMan",
    choices: [],
  },
];

const updateEmployee = [
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "updEmp",
    choices: [],
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee?",
    name: "updRole",
    choices: [],
  },
];

module.exports = {
  options, deptAdd, 
  roleAdd, employeeAdd, 
  updateEmployee
};