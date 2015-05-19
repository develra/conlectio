'use strict';

class PreviewCtrl {
  constructor(Shared_Data) {
    this.fileList = Shared_Data;
  };

}
PreviewCtrl.$inject = ['Shared_Data'];

export default PreviewCtrl;
