'use strict';

class LoginModalCtrl{

  constructor($scope){
    this.scope = $scope;
  };

  cancel(){
    console.log("cancel closed");
    this.scope.$dismiss();
  };

  submit(user) {
    //UsersApi.login(email, password).then(function (user) {
    console.log(user);
    this.scope.$close();
  };
}
LoginModalCtrl.$inject = ['$scope'];
export default LoginModalCtrl;
