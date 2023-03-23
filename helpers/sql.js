const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/* 
  *
  * This helper function will update a sql table based on the data passed through.
  * Not everything from a table needs to be provided, it will only update whats passed through the function.
  * 
  * Data to update should be an object: {handle: "Company", num_employees: 100}
  * It also takes objects with JS to convert to column tables: {companyLogo: "logo"} RETURNS SQL--> "logo" = $1 
  * 
  * Returns the columns that need to be set, along with values of the object

*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
