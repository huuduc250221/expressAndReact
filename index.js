var express = require('express')
var app = express()
var cors = require('cors')
var multer = require('multer')
var compression = require('compression')
var path = require('path');
require('dotenv/config');

app.use(compression());
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(express.static('uploads'))

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('file:',file)
        cb(null, 'uploads/image')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
        console.log('file name:',file)
    }
});

var upload = multer({ storage: storage });
app.post('/uploads', upload.single('image'), (req, res, next) => {
    console.log(req.file)
    res.send(`${req.protocol}://${req.get('host')}/image/${req.file.filename}`)
});

app.listen(process.env.PORT, () => {
    console.log(`app listen on port ${process.env.PORT||5000}`)
})