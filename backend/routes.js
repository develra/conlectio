// Modules & Models
var Nerd = require('./models/nerd');
var FileField = require('./models/filefield');
var multiparty = require('multiparty');
var fs = require('fs');
var Papa = require('babyparse');

    module.exports = function(app) {
        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/viewdata', function(req, res) {
            // use mongoose to get all our filefields
            // we are going to build up our query to avoid pulling in unneeded data
            var query = FileField.find({})
            //select only the needed fields
            query.select('file key demo');
            query.exec(function (err, data){
                if (err)
                    res.send(err);
                res.send(data);
            });
        });

        app.get('/api/realdata', function(req, res) {
          //build up $in selector
          var keyList = []
          for (key in req.query) {
            //avoid prototype chain grossness
            if (!req.query.hasOwnProperty(key))
              continue;
            keyList.push(req.query[key]);
          }
          //build up our query
          var query = FileField.find({'key': {'$in': keyList}});
          query.select('data');
          query.exec(function (err, data){
            if (err)
              res.send(err)
            res.send(data);
          });
        });

        // route to handle creating goes here (app.post)
        app.post('/admin/upload', function(req, res) {
          var form = new multiparty.Form()
          form.on('error', function(err) {
            console.log('Error parsing form: ' + err.stack);
          });
          //Track progress for the log
          form.on('progress', function(bytesReceived, bytesExpected){
            console.log(bytesReceived+"/"+bytesExpected+" bytes received");
          });
          //Handles the uploaded file
          form.on('file', function(name,file){
            fs.readFile(file.path, 'utf8', function(err, data){
              if (err) throw err;
              parseCSV(data, file.originalFilename);
            });
          });

          form.on('close', function(file) {
            res.send('Recieved and Parsed file');
          });
          form.parse(req);
        });
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./frontend/index.html');
        });
    };

//Helper Functions
function parseCSV(csvFile, fileName){
    //fileName is optional
    if(typeof fileName === "undefined")
      fileName = csvFile.name;
    //After days of work, abandon it all and use papa parse instead
    //The more you know!
    var parsedCsv = Papa.parse(csvFile,{
      config: {
        skipEmptyLines: true
      }
    });
    var fields = []
    var fieldsSize = parsedCsv.data[0].length;
    for(var i = 0; i<fieldsSize; i++)
      fields[i] = [];
    //these two for loops essentially change our csv from being "row" delimited
    //to "column" delimited
    for(var i = 0; i<parsedCsv.data.length; i++)
      for(var j = 0; j<fieldsSize; j++)
        fields[j][i] = parsedCsv.data[i][j];
      //finally, lets push our fields to mongodb
      for(var i = 0; i<fields.length; i++){
        var newFileField = FileField({
          file: fileName,
          key: fields[i][0],
          demo: fields[i].slice(0,25),
          data: fields[i]
        });
        //delete the _id field to make mongodb happy
        var tempFileField = newFileField.toObject()
        delete tempFileField._id;
        //Use update with upsert instead of save to prevent duplicates
        FileField.update(
          //query param (acts as an _id here)
          { file: fileName,
            key: fields[i][0]
          },
          //object to save sans _id
          tempFileField,
          //save or update
          {upsert: true},
          //callback
          function(err, numberAffected, raw) {
          if (err)
              throw err
          else{
            if (raw.updatedExisting == true)
              console.log(numberAffected + ' FileField Updated');
            else
              console.log(numberAffected + ' FileField Created');
          }
        });
      }
  }
