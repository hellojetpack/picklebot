const config = require('./config');

if (!config('CLIENT_ID') || !config('CLIENT_SECRET') || !config('PORT')) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot({
    stats_optout: true,
    clientId: config('CLIENT_ID'),
    clientSecret: config('CLIENT_SECRET'),
    rtm_receive_messages: false,
    // debug: true,
    scopes: ['bot'],
    json_file_store: __dirname + '/.db/' // store user data in a simple JSON format
});

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Enable Dashbot.io plugin
require(__dirname + '/components/plugin_dashbot.js')(controller);


var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('Make sure to add your CLIENT_ID, CLIENT_SECRET, PORT, AND DASHBOT_KEY in the .env file');
    console.log('Get Slack app credentials here: https://api.slack.com/apps')
    console.log('Get a dashbot API key here: https://www.dashbot.io')
    console.log('~~~~~~~~~~');
}
