module.exports = function parseStringAsArray(stringArray) {
  return stringArray.split(",").map(tech => tech.trim());
};
