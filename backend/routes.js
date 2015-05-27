// grab the nerd model we just created
var Nerd = require('./models/nerd');
    module.exports = function(app) {
    var multiparty = require('multiparty');
        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/nerds', function(req, res) {
            // use mongoose to get all nerds in the database
            Nerd.find(function(err, nerds) {
                if (err)
                    res.send(err);
                res.json(nerds); // return all nerds in JSON format
            });
        });

        // route to handle creating goes here (app.post)
        app.post('/admin/upload', function(req, res) {
          var form = new multiparty.Form()
          form.on('error', function(err) {
            console.log('Error parsing form: ' + err.stack);
          });

          form.on('part', function(part){
            console.log(part.filename);
            console.log(part.byteCount);
            console.log(part['content-type']);
            part.resume();
          });

          form.on('progress', function(bytesReceived, bytesExpected){
            console.log(bytesReceived);
            console.log(bytesExpected);
          });

          form.on('close', function() {
            console.log('Upload completed');
            res.send('Received files');
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
