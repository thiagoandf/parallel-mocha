const express = require("express");
const path = require("path");
const fs = require('fs');
const unzipper = require('unzipper');
const multer = require('multer');
const marge = require('mochawesome-report-generator')
const { merge } = require('mochawesome-merge')

const archiver = require('archiver');

const archive = archiver('zip');

const upload = multer({ dest: 'uploads/' })

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, '../report-generator/build')));

app.post('/report', upload.single('report'), (req, res) => {
  fs.createReadStream(req.file.path).pipe(unzipper.Extract({ path: 'content/' }))
  setTimeout(() => {
    merge({ files: ['content/e2e/output/*/*.json'] }).then(report => {
      marge.createSync(JSON.stringify(report), {});

      const output = fs.createWriteStream('target.zip');

      output.on('close',  () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });

      archive.on('error', function(err){
        throw err;
      });

      archive.pipe(output);

      archive.directory('mochawesome-report', '');

      archive.finalize().then(() => {
        res.download('./target.zip');
      });
    });
  }, 2000);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../report-generator/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
