const handleSignin = (req, res, pgdatabase, bcrypt) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission.");
  }
  pgdatabase.select("email", "hash").from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password,data[0].hash);
      if (isValid) {
        return pgdatabase.select("*").from("users")
        .where("email", "=", email)
        .then(user => {
          res.json(user[0])
        })
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credential"))
};

module.exports = {
  handleSignin: handleSignin
}