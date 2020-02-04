const axios = require("axios");
const Dev = require("../models/Devs");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections } = require("../websocket");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const ApiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = ApiResponse.data;

      const tecshArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: tecshArray,
        location
      });

      console.log(latitude, longitude);

      const sendMessageSocketTo = findConnections(
        { latitude, longitude },
        tecshArray
      );

      console.log(sendMessageSocketTo);
    }

    return res.json(dev);
  }
};
