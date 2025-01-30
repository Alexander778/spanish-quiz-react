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
    // Write the JSON array to a TS file
    const outputFilePath = path.join(__dirname, "../data/words.ts");
    fs.writeFileSync(
      outputFilePath,
      `import { Word } from './types';
      
export const words: Word[] = ${JSON.stringify(jsonArray, null, 2)};`
    );
    console.log(
      "CSV file successfully processed and written to words.ts. Count:",
      jsonArray.length
    );
  });
