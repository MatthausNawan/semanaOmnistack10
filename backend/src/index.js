const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const http = require("http");
const { setupWebSocker } = require("./websocket");

const app = express();

const server = http.Server(app);

setupWebSocker(server);

mongoose.connect(
  "mongodb+srv://omnistack10:omnistack10@semanaomnistack10-4jmby.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
