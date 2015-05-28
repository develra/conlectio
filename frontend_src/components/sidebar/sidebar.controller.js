'use strict';
class SidebarCtrl {

  constructor(Shared_Data) {
    this.fileList = Shared_Data;
  };

  toggle(field){
    field.active = !field.active;
  }
};

SidebarCtrl.$inject = ['Shared_Data'];
export default SidebarCtrl;
