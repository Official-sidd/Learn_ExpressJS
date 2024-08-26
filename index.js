const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8001;
const users = require("./MOCK_DATA.json");
const baseURL = "/api";

//middleware to accept data sent from frontend
app.use(express.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  res.send("Welcome to backend");
});

app.get(`${baseURL}/users`, (req, res) => {
  return res.json(users);
});

// app.get(`${baseURL}/users/:id`, (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id == id);
//   return res.json(user);
// });

app
  .route(`${baseURL}/users/:id`)
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ status: "User not found" });
    }

    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ status: "Error updating user" });
      }
      return res.json({ status: "User updated", user: updatedUser });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ status: "User not found" });
    }

    users.splice(index, 1);

    // Update the IDs of the remaining users
    for (let i = index; i < users.length; i++) {
      users[i].id = i + 1;
    }

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ status: "Error deleting user" });
      }
      return res.json({ status: "User deleted" });
    });
  });

app.post(`${baseURL}/users`, (req, res) => {
  const body = req.body;
  const user = { id: users.length + 1, ...body };
  users.push(user);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "completed adding user" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
