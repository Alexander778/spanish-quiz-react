const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Path to the CSV file
const csvFilePath = path.join(__dirname, "../data/words.csv");

// Array to hold the parsed data
const jsonArray = [];

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv(["word", "translation", "type"])) // Define headers as the CSV does not have headers
  .on("data", (row) => {
    // Push each row into the jsonArray
    jsonArray.push(row);
  })
  .on("end", () => {
    // Write the JSON array to a JavaScript file
    const outputFilePath = path.join(__dirname, "../data/words.js");
    fs.writeFileSync(
      outputFilePath,
      `var words = ${JSON.stringify(jsonArray, null, 2)};`
    );
    console.log(
      "CSV file successfully processed and written to words.js.Count:",
      jsonArray.length
    );
  });
