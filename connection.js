import mysql from "mysql";

export var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "acme",
  port: 3306
});
connection.connect((err) => {
  if (err) {
    console.log("DB connection failed");
    throw "DB connection failed";
  } else {
    console.log("DB connected success");
  }
});
