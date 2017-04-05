console.log('loaded localtunnel.js');
const localtunnel = require('localtunnel');
const opts = {
    subdomain: 'hellojetpack0'
};
const tunnel = localtunnel(3000,opts, function(err, tunnel) {
    if (err) {
      console.log(' something is seriously wrong with your localtunnel settings!');
      return false;
    }

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    tunnel.url;
    console.log(tunnel.url);
});

tunnel.on('close', function() {
    console.log('tunnels closed');
});
