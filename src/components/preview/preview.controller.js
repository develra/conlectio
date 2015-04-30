'use strict';

class PreviewCtrl {
  constructor(Shared_Data) {
    this.fileList = Shared_Data;
    console.log(this.fileList);
  };

}
PreviewCtrl.$inject = ['Shared_Data'];

export default PreviewCtrl;
