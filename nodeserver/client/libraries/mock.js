const fs = require('fs');

const Hyperbeam = require('hyperbeam');
const { connected } = require('process');
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(function () {
      console.log('Blah blah blah blah extra-blah')
    }, 3000)
  })
}
async function createChannel(channelID, code) {
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


  await beam.on('connected', function () {
    console.error(
      '[hyperbeam] Success! Encrypted tunnel established to remote peer',
    )

    console.log(Object.keys(beam))

    // const name = prompt('What is your name?')

  })

  var util = require('util')

function hook_stdout(callback) {
    var old_write = process.stdout.write

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            write.apply(process.stdout, arguments)
            callback(string, encoding, fd)
        }
    })(process.stdout.write)

    return function() {
        process.stdout.write = old_write
    }
}


var unhook = hook_stdout(function(string, encoding, fd) {
    util.debug('stdout: ' + util.inspect(string))
})
var foo =''
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    process.stdin.pipe(beam).pipe(process.stdout)
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}
async function callIn(){  
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);
}
 process.stdin.pipe(beam).resume(beam.write(code))

await process.stdin.pipe(beam).pipe(process.stdout)

unhook()



  process.stdin.pipe(beam).resume(beam.read)

  let t = toString(process.stdout)
  let buff = decodeURIComponent(Buffer.from(t, 'base64'));  
  let text = buff.toString('utf-8');

  console.log(`Peer: I am executing ${text}`)

  beam.on('end', () => {
    beam.end(beam.read)
    process.stdin.pipe(beam).pipe('NO ONE IS FUCKING HERE')
  })

  beam.resume()
  beam.pause()

  process.once('SIGINT', () => {
    if (!beam.connected) closeASAP()
    else beam.end()
  })

  function closeASAP() {
    console.error('[hyperbeam] Shutting down beam...')

    const timeout = setTimeout(() => process.exit(1), 2000)
    beam.destroy()
    beam.on('close', function () {
      clearTimeout(timeout)
    })
  }
  return beam
}

exports.createChannel = createChannel
