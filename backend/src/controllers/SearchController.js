const Dev = require("../models/Devs");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    const { techs, longitude, latitude } = req.query;
    console.log(techs, longitude, latitude);
    const techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    });
    return res.json({ devs });
  }
};
