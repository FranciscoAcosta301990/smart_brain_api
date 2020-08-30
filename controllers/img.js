const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "868b55436284401cb125fb4af278bbd4",
});

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json("Unable to work with api."))
}

const handleImage = (req, res, pgdatabase) => {
  const {id} = req.body;
  pgdatabase("users").where({id})
  .increment("entries", 1)
  .returning("entries")
  .then(entries => {
    res.json(entries[0]);
  })
    .catch(err => res.status(400).json("unable to get entries"))
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}