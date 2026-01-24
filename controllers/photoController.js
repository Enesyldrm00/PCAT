const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');
exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos,
  })};

exports.getPhoto =  async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
}
exports.createPhoto = async (req, res) => {
  let uploadedImage = req.files.image;
  const slugify = (text) => {
  return text
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .replace(/\s+/g, '-');
};
let imageName = Date.now() + '-' + slugify(uploadedImage.name);

let uploadPath = path.join(__dirname, '../public/uploads', imageName);


uploadedImage.mv(uploadPath, async () => {
  await Photo.create({
    ...req.body,
    image: '/uploads/' + imageName,
  });
  res.redirect('/');
})};
