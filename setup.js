var prompt = require('prompt');
var crypto = require('crypto');
var fs = require('fs');

prompt.start();
prompt.message = "Conlectio Config".green;
prompt.delimiter = ": ".green;

function configRoot(){
  prompt.get([{
    name: 'external_db',
    description: 'Would you like to create a new mongodb instance, or connect to an external db? (create/connect)',
    pattern: /connect|create/,
    message: 'Invalid option - you must either input \'connect\' or \'create\'',
    type: 'string',
    required: true
  }],
  function (err, result) {
    if (result.external_db === 'create')
      createDbBranch();
    else if (result.external_db == 'connect')
      connectDbBranch();
    else
      throw err;
  });
}

function createDbBranch() {
  prompt.get([{
    name: 'db_name',
    description: 'Name your database',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true
  },
  {
    name: 'collection_name',
    description: 'Name your collection',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true
  },
  {
    name: 'adminName',
    description: 'Admin Username - this will be used both to connect to the Database and to access the Admin Panel',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true
  },
  {
    name: 'adminPassword',
    description: 'Admin Password - this will be used both to connect to the Database and to access the Admin Panel',
    pattern: /[\S]{8}/,
    hidden: true,
    message: 'Invalid option - must be 8 or more characters and not contain whitespace',
    type: 'string',
    required: true,
    //hash password before storing it in any variable
    before: function(value) {
      return crypto.createHash('sha256').update(value).digest('hex');
    }
  }
  ],
  function (err, result) {
    if (err)
      throw err;
    else{

      console.log(result)
      generateConfig(result);
    }
  });
}

function connectDbBranch() {
  prompt.get([{
    name: 'db_uri',
    description: 'What is the URI of your Database? ' +
      '(format of mongodb://dbuser:dbpass@host:port/dbname)',
    type: 'string',
    required: true
  },
  {
    name: 'collection_name',
    description: 'Name your collection',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true
  },
  {
    name: 'adminName',
    description: 'Admin Username - this will be used to access the Admin Panel',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true
  },
  {
    name: 'adminPassword',
    description: 'Admin Password - this will be used both access the Admin Panel',
    pattern: /[\S]{8}/,
    hidden: true,
    message: 'Invalid option - must be 8 or more characters and not contain whitespace',
    type: 'string',
    required: true,
    //hash password before storing it in any variable
    before: function(value) {
      return crypto.createHash('sha256').update(value).digest('hex');
    }
  }
  ],
  function (err, result) {
    if (err)
      throw err;
    else{
      console.log(result)
      generateConfig(result);
    }
  });
}

function generateConfig(data){
  //give information about type of database
  if(data.hasOwnProperty('db_uri'))
    data.db_type = 'external';
  else
    data.db_type = 'interal';
  //write to the config file
  var stream = fs.createWriteStream("config/config.js");
  stream.once('open', function(fd) {
    stream.write(JSON.stringify(data));
    stream.end();
  });
}

configRoot();
