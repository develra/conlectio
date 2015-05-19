'use strict';
class SidebarCtrl {

  constructor(Shared_Data) {
    this.filesIn = [];
    this.fileList = Shared_Data;
  };

  handleFiles(files) {
    //make sure File API is supported
    if (window.FileReader) {
      //send them off to the proper parser
      for (var i = 0; i < files.length; i++){
        //get the filetype by splicing off the last .extension
        let fileNameArray = files[i].name.split(".");
        //this pop() is unsecure- fine for the local tool, but make
        //sure to fix it for anything online
        let fileExtension = fileNameArray.pop();
        switch(fileExtension){
          case "csv":
            this.parseCSV(files[i]);
            break;
          case "tsv":
            //Papa Parse will autodetect the delimiter
            this.parseCSV(files[i]);
            break;
          case "json":
            this.jsonToCSV(files[i]);
            break;
          default:
            alert(fileExtension + " is an unsupported file type");
        }
      }
    }
    else
      alert("File API is not supported - please upgrade your browser");
  };

  parseCSV(csvFile, fileName){
    //fileName is optional
    if(typeof fileName === "undefined")
      fileName = csvFile.name;
    //After days of work, abandon it all and use papa parse instead
    //The more you know!
    Papa.parse(csvFile, {
      skipEmptyLines: true,
      complete: function(result) {
        var fields = []
        var fieldsSize = result.data[0].length;
        //2d arrays in javascript are strange, we need to initialize the 2nd part
        for(let i = 0; i<fieldsSize; i++)
          fields[i] = [];
        //these two for loops essentially change our csv from being "row" delimited
        //to "column" delimited
        for(let i = 0; i<result.data.length; i++)
          for(let j = 0; j<fieldsSize; j++)
            fields[j][i] = result.data[i][j];
        //finally, lets save our fields to our shared list
        for(let i = 0; i<fields.length; i++){
          let fieldObj = {"key": fields[i][0], "active": false, "file": fileName, "data": fields[i]};
          console.log(fieldObj);
          this.fileList.push(fieldObj);
          console.log(this.fileList.length);
        }
      }.bind(this)
    });
  };

  jsonToCSV(jsonFile){
    var reader = new FileReader();
    reader.readAsText(jsonFile);
    reader.onload = function(e) {
    //Papa unparse takes a jsonFile and converts it to csv
      var csvFile = Papa.unparse(reader.result);
      this.parseCSV(csvFile, jsonFile.name);
    }.bind(this);
  };

  toggle(field){
    field.active = !field.active;
  }
};

SidebarCtrl.$inject = ['Shared_Data'];
export default SidebarCtrl;
