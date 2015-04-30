'use strict';

class NavbarCtrl {
  constructor(Shared_Data) {
    this.orgName = 'Conlect';
    this.livingFileName = 'conlect';
    this.extensions = ['.csv', '.json'];
    this.selectedExtension = '.csv';
    this.fileList = Shared_Data;
  }

  download() {
    //build the csv
    var csvRows = []
    //Loop through active fields
    for(let j = 0; j<this.fileList[0].data.length; j++){
      csvRows[j] = ""
      for(let i = 0; i<this.fileList.length; i++){
        if(this.fileList[i].active == true){
          csvRows[j]+= this.fileList[i].data[j]+',';
        }
      }
      //cleaning up a trailing comma
      csvRows[j] = csvRows[j].substring(0, csvRows[j].length-1);
    }
    var csvString = csvRows.join("\r\n");
    var a = document.createElement('a');
    a.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(csvString);
    a.target = '_blank';
    a.download = this.livingFileName+this.selectedExtension;
    document.body.appendChild(a);
    a.click();
  }

  test() {
    console.log(this.selectedExtension);
  }
}

NavbarCtrl.$inject = ['Shared_Data'];

export default NavbarCtrl;
