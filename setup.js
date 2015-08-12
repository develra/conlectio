var prompt = require('prompt');
var crypto = require('crypto-js');
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
    name: 'db_uri',
    description: 'Name your database',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true,
    before: function(value) {
      return 'mongodb://localhost/'+value;
    }
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
    description: 'Admin Username - this will be used both to access the Admin Panel',
    message: 'Invalid option - please use only letters, numbers, and underscores (_)',
    type: 'string',
    required: true
  },
  {
    name: 'adminPassword',
    description: 'Admin Password - this will be used to access the Admin Panel',
    pattern: /[\S]{8}/,
    hidden: true,
    message: 'Invalid option - must be 8 or more characters and not contain whitespace',
    type: 'string',
    required: true,
    //hash password before storing it in any variable
    before: function(value) {
      return crypto.SHA3(value).toString();
    }
  }
  ],
  function (err, result) {
    if (err)
      throw err;
    else{
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
      return crypto.createHash('sha3').update(value).digest('hex');
    }
  }
  ],
  function (err, result) {
    if (err)
      throw err;
    else{
      generateConfig(result);
    }
  });
}

function generateConfig(data){
  //write to the db config file
  var dbObj = {}
  dbObj.uri = data.db_uri
  dbObj.collection = data.collection_name
  var dbStream = fs.createWriteStream("config/db.js");
  dbStream.once('open', function(fd) {
    dbStream.write('var db = {};\n');
    dbStream.write('db = ' + JSON.stringify(dbObj) + ';\n');
    dbStream.write('module.exports = db;\n');
    dbStream.end();
  });
  //write to the admin config file
  var adminObj = {}
  adminObj.username = data.adminName;
  adminObj.password = data.adminPassword;
  var adminStream = fs.createWriteStream("config/adminCreds.js");
  adminStream.once('open', function(fd) {
    adminStream.write('var admin = {};\n');
    adminStream.write('admin = ' + JSON.stringify(adminObj) + ';\n');
    adminStream.write('module.exports = admin;\n');
    adminStream.end();
  });
}

configRoot();
