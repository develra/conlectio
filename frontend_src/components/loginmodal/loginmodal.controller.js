'use strict';

class LoginModalCtrl{

  constructor($scope){
    this.scope = $scope;
  };

  cancel(){
    //this.scope.$dismiss;
  };

  submit(email, password) {
    //UsersApi.login(email, password).then(function (user) {
    //this.scope.$close();
  };
}
LoginModalCtrl.$inject = ['$scope'];
export default LoginModalCtrl;
