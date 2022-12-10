const b64 = require('base-64');
const utf8 = require('utf8');

function encode(data) {
  let uEnv = b64.encode(utf8.encode(data))
  return String(uEnv)
}
  
function decode(encoded) {
  let uEnv = b64.decode(utf8.decode(encoded))
  return String(uEnv)
}



module.exports = {
  
  encode,
  decode
}