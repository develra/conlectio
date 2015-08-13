'use strict';
class AdminSidebarCtrl {

  constructor(Shared_Data, Upload, $http) {
    this.filesIn = [];
    this.fileList = Shared_Data;
    this.Upload = Upload;
    this.http = $http;
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
            this.sendCSV(files[i]);
            break;
          case "tsv":
            //Papa Parse will autodetect the delimiter
            this.sendCSV(files[i]);
            break;
          case "json":
            this.sendJSON(files[i]);
            break;
          default:
            alert(fileExtension + " is an unsupported file type");
        }
      }
    }
    else
      alert("File API is not supported - please upgrade your browser");
  };

  sendCSV(csvFile, fileName){
    //fileName is optional
    if(typeof fileName === "undefined")
      fileName = csvFile.name;
    this.Upload.upload({
      url: '/admin/upload/',
      file: csvFile
    }).success(function(data, status, headers, config) {
       console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
    }).error(function(status){
      console.log('request failed with status' + status);
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

  remove(field){
    console.log('remove called with', field);
    this.http.delete('/admin/delete/' + field._id).then(function(response){
      console.log(response);
      for(var i in this.fileList){
        if(this.fileList[i]._id === response.data){
            this.fileList.splice(i, 1);
        }
      }
    }.bind(this));
  }
};

AdminSidebarCtrl.$inject = ['Shared_Data', 'Upload', '$http'];
export default AdminSidebarCtrl;
