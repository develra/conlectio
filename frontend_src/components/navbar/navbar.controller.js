'use strict';
import LZMA_decompress from './lzma_d.js'

class NavbarCtrl {
  constructor(Shared_Data, $http) {
    this.orgName = 'Conlect';
    this.livingFileName = 'conlect';
    this.extensions = ['.csv', '.json'];
    this.selectedExtension = '.csv';
    this.fileList = Shared_Data;
    this.http = $http;
  }

  exportChain(){
    this.getData();
  }

  getData(){
    //we only want to get the active fields
    var activeFields = [];
    for (let i = 0; i<this.fileList.length; i++)
      if(this.fileList[i].active === true)
        activeFields.push(this.fileList[i].key);
    //http.get doesn't like .bind(this) due to its promisetory nature - workaround
    var that = this;
    this.http.get('/api/realdata', {params: activeFields})
     .success(function(data){
       LZMA_decompress.decompress(data, function(decompressed_data){
         decompressed_data = JSON.parse(decompressed_data);
         that.buildCsvDocument(decompressed_data);
       });
     })
     .error(function(data,status){
       console.log(data + ' failed with status ' + status);
     });
  }

  buildCsvDocument(fullFields){
    if (fullFields.length == 0){
      console.log("No fields selected");
      return;
    }
    var csvRows = []
    for(let j = 0; j<fullFields[0].data.length; j++){
      csvRows[j] = ""
      for(let i = 0; i<fullFields.length; i++){
          csvRows[j]+= fullFields[i].data[j]+',';
        }
      //cleaning up a trailing comma
      csvRows[j] = csvRows[j].substring(0, csvRows[j].length-1);
      }
    this.download(csvRows);
    }

  download(csvRows) {
    var csvString = csvRows.join("\r\n");
    var a = document.createElement('a');
    a.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(csvString);
    a.target = '_blank';
    a.download = this.livingFileName+this.selectedExtension;
    document.body.appendChild(a);
    a.click();
  }

}

NavbarCtrl.$inject = ['Shared_Data', '$http'];
export default NavbarCtrl;
