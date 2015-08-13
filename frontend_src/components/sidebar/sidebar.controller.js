'use strict';
class SidebarCtrl {

  constructor(Shared_Data) {
    this.fileList = Shared_Data;
  };

  toggle(field){
    console.log(this.fileList);
    field.active = !field.active;
  }
};

SidebarCtrl.$inject = ['Shared_Data'];
export default SidebarCtrl;
