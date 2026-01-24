const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const fs = require('fs');
const methodOverride = require('method-override');
const photoController = require('./controllers/photoController');

const app = express();

// Mongoose Connect
mongoose
  .connect('mongodb://127.0.0.1:27017/pcat-test-db')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

//Template Engine
app.set('view engine', 'ejs');

//midleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method'));
//routes

app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);

app.get('/add', (req, res) => {
  res.render('add'); //Bir view  dosyasını alır, HTML’e çevirir ve client’a gönderir
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const { title, description } = req.body;
  await Photo.findByIdAndUpdate(req.params.id, {
    title,
    description,
  });

  res.redirect(`/photos/${req.params.id}`);
});
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.redirect('/');

  const filePath = path.join(__dirname, 'public', photo.image);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await Photo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

//port
const port = 3000;

app.listen(port, () => {
  console.log('sunucu çaalıştı');
});
