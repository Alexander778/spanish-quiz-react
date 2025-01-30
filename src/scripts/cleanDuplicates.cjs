const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Path to the CSV file
const csvFilePath = path.join(__dirname, "../data/words.csv");

// Store processed rows
const processed = new Map();

fs.createReadStream(csvFilePath)
  .pipe(csv({ headers: ["word", "translation", "type"] }))
  .on("data", (row) => {
    const { word, translation, type } = row;

    // Check for duplicates and log them
    if (processed.has(word)) {
      console.log(`Duplicate found: ${word}`);
    } else {
      processed.set(word, { word, translation, type });
    }
  })
  .on("end", () => {
    // Create the cleaned CSV data
    const csvData = [];
    processed.forEach(({ word, translation, type }) => {
      csvData.push(`${word},${translation},${type}\n`);
    });

    // Overwrite the input CSV file with cleaned data
    fs.writeFile(csvFilePath, csvData.join(""), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("CSV file has been cleaned and updated.");
      }
    });
  })
  .on("error", (error) => {
    console.error("Error reading the file:", error);
  });
