const fs = require('fs');
const path = require('path');

function generateJson(suites) {
  const passes = suites.reduce((acc, curr) => acc + curr.passes.length, 0);
  const failures = suites.reduce((acc, curr) => acc + curr.failures.length, 0);
  const tests = suites.reduce((acc, curr) => acc + curr.tests.length, 0);
  return {
    "stats": {
      "suites": suites.length,
      tests,
      passes,
      "pending": 0,
      failures,
      "start": new Date().toISOString(),
      "end": new Date().toISOString(),
      "duration": 0,
      "testsRegistered": suites.length,
      "passPercent": (passes / tests) * 100,
      "pendingPercent": 0,
      "other": 0,
      "hasOther": false,
      "skipped": 0,
      "hasSkipped": false,
      "passPercentClass": "success",
      "pendingPercentClass": "danger"
    },
    "suites": {
      "uuid": "7ec34ff4-e0aa-46bd-8055-4e2b6af00702",
      "title": "",
      "fullFile": "",
      "file": "",
      "beforeHooks": [],
      "afterHooks": [],
      "tests": [],
      "suites": suites,
      "passes": [],
      "failures": [],
      "pending": [],
      "skipped": [],
      "duration": 0,
      "root": true,
      "rootEmpty": true,
      "_timeout": 0
    },
    "copyrightYear": new Date().getFullYear(),
  }
}

const getAllFiles = function(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}


module.exports =  {
  process_contents: () => {
    const files = getAllFiles('content/output');
    let suites = [];
    files.forEach(file => {
      if (path.extname(file) === '.json') {
        const filename = `content/output${file.split('content/output').pop()}`
        const data = fs.readFileSync(filename, 'utf8');
        suites = [
          ...suites,
          ...JSON.parse(data).suites.suites,
        ]
      }
    });
    return generateJson(suites);
  }
}