const inquirer = require("inquirer");
const { options } = require("./prompts/userPrompts");
const { db, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, } = require('./config/databaseFunctions');

// function to start the application
async function startApp() {
  let exitLoop = false;

  while(!exitLoop) {
    try {
      // display main menu using inquirer
      const { userChoice } = await inquirer.prompt(options);
  
      // perform actions based on user choice
      switch (userChoice) {
        case 1:
          await viewAllDepartments();
          break;
        case 2:
          await viewAllRoles();
          break;
        case 3:
          await viewAllEmployees();
          break;
        case 4:
          await addDepartment();
          break;
        case 5:
          await addRole();
          break;
        case 6:
          await addEmployee();
          break;
        case 7:
          await updateEmployeeRole();
          break;
        case 8:
          exitLoop = true;
          console.log("Exiting the application. Goodbye!")
          db.end();
          return;
        default:
          console.log("Exiting the application. Goodbye!");
          db.end();
          return;
      }
    } catch (err) {
      console.error("Error in starting application:", err);
    }
  }
};

startApp();