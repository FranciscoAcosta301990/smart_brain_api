const showData = (name, email, password, hash) => {
  console.log("hanleRegistrationName" + name)
  console.log("hanleRegistrationEmail" + email)
  console.log("hanleRegistrationPassword" + password)
  console.log("hanleRegistrationHash" + hash)
}

const handleRegister = (req, res, pgdatabase, bcrypt) => {
  const {name, email, password} = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission.");
  }
  const hash = bcrypt.hashSync(password);
  
  pgdatabase.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into("login")
    .returning("email")
    .then(loginEmail => {
      return trx("users")
        .returning("*")
        .insert({
          name: name,
          email: loginEmail[0],
          joined: new Date()
        }).then(user => {
          console.log("users" + user[0])
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
    .catch(err => res.console.log(
      "hanleRegistrationName " + name +
      " hanleRegistrationEmail " + email +
      " hanleRegistrationPassword " + password))
};

module.exports = {
  handleRegister: handleRegister
}