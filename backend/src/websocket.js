const socketio = require("socket.io");
const parseStringAsArray = require("./utils/parseStringAsArray");
const calculateDistance = require("./utils/calculateDistance");
const connections = [];

exports.setupWebSocker = server => {
  const io = socketio(server);

  io.on("connection", socket => {
    const { latitude, longitude, techs } = socket.handshake.query;
    console.log(socket.id);
    console.log(socket.handshake.query);

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: parseStringAsArray(techs)
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  console.log(coordinates, techs);
  console.log(connections);
  return connections.filter(connection => {
    return (
      calculateDistance(coordinates, connections.coordinates) < 10 &&
      connection.techs.some(item => techs.includes(item))
    );
  });
};
