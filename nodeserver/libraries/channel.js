const fs = require('fs');
const tools = require ("./tools");
const Hyperbeam = require('hyperbeam');
const { connected, stdout } = require('process');
const path = require('path')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(function () {
    }, 3000)
  })
}
var lol;
var string;

async function searchForRelevantDoc (beam) {  
  var spawn = require('child_process').spawn,
  py    = spawn('python', [path.join(__dirname, 'result.py')]),
  output = '';

  py.stdin.setEncoding = 'utf-8';

  py.stdout.on('data', (data) => {
    output += data.toString();
    console.log('output was generated: ' + output);
    beam.write(output)
  });
  // Handle error output
  py.stderr.on('data', (data) => {
  // As said before, convert the Uint8Array to a readable string.
    console.log('error:' + data);
  });
  py.stdout.on('end', async function(code){
    beam.write(output)
  });
  beam.write(output)
  return output; 
}


async function createChannel(channelID, code, res) {
  console.log('connecting to channID ' + channelID)
  console.log(`using code ${code}`)

  const beam = new Hyperbeam(channelID)

  beam.on('remote-address', async function ({ host, port }) {
    if (!host) console.error('[hyperbeam] Could not detect remote address')
    else
      console.error(
        '[hyperbeam] Joined the DHT - remote address is ' + host + ':' + port,
      )
    if (port) {
      console.error('[hyperbeam] Network is holepunchable \\o/')
      console.log(Object.keys(beam))
      //await sleep(1000)
    }
  })
  beam.on('connected', function () {
    console.error(
      '[hyperbeam] Success! Encrypted tunnel established to remote peer',
    ) 
    
  });
  beam.on('data', data => {
    data = tools.decode(data.toString())
    process.stdout.write("\n"+data +"\n")
    fs.writeFile("./libraries/result.py",  data, err => {
      if (err) throw err;
      console.log('File successfully written to disk');
      try {  
        var subprocess = searchForRelevantDoc(beam)
        sleep(20000);
      }
      catch {
        subprocess.stderr.on('data', (data) => {
          console.log(`error:${data}`);
        });
      }
    });  
  }); 
  const fs = require("fs");

  var err='nn'

  console.log(`Peer: I am executing ${stdout}`)

  process.once('SIGINT', () => {
    if (!beam.connected) closeASAP()
    else beam.end()
  })

  
  return beam;
}

function closeASAP(beam) {
  console.error('[hyperbeam] Shutting down beam...')

  const timeout = setTimeout(() => process.exit(1), 2000)
  beam.destroy()
  beam.on('close', function () {
    clearTimeout(timeout)
  })
}
exports.createChannel = createChannel
/*

async function reaStream() {
  console.log('calling');
  const result = await resolveAfter2Seconds(function (err, result, fields) {
    fs.writeFile("result.txt", result, err => {
         if (err) throw err;
         console.log('File successfully written to disk');
    }) });
  console.log(result);
}
*/



