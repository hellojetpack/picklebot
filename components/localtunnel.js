const localtunnel = require('localtunnel');
const config = require('../config');

// set localtunnel config options
const opts = {
  subdomain: config('LOCALTUNNEL_SUBDOMAIN'),
};

// call localtunnel and check for errors then log the tunnel url
const tunnel = localtunnel(3000, opts, (err, tunnelObj) => {
  if (err) {
    console.log(' something is seriously wrong with your localtunnel settings!');
    return false;
  }

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  console.log(tunnel.url);
  return tunnel.url;
});

tunnel.on('close', () => {
  console.log('tunnels closed');
});
