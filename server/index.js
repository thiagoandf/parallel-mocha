const { process_contents } = require("./file_parser");

const express = require("express");
const path = require("path");
const fs = require('fs');
const unzipper = require('unzipper');
const multer = require('multer');
const marge = require('mochawesome-report-generator')
const { merge } = require('mochawesome-merge')


const upload = multer({ dest: 'uploads/' })

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post('/report', upload.single('report'), (req, res) => {
  fs.createReadStream(req.file.path).pipe(unzipper.Extract({ path: 'content/' }));

  console.log('process_contents', process_contents());

  // merge({ files: process_contents() }).then(report => console.log('report', report));

  fs.writeFileSync('content/file.json', JSON.stringify(process_contents()));

  marge.createSync(fs.readFileSync('content/file.json', 'utf-8'), {})

  // res.download();
  res.sendStatus(201);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
