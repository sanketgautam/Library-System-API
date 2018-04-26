const libraryRoutes = require("./library_routes");
const studentRoutes = require("./student_routes");
const employeeRoutes = require("./employee_routes");

module.exports = function(app, db) {
	libraryRoutes(app, db);
	studentRoutes(app, db);
	employeeRoutes(app, db);
}