'use strict';
import CryptoJS from './sha3.js';

class LoginModalCtrl{

  constructor($scope, $rootScope, $http){
    this.scope = $scope;
    this.rootScope = $rootScope;
    this.http = $http;
  };

  cancel(){
    console.log("cancel closed");
    this.scope.$dismiss();
  };

  submit(user) {
    user.password = CryptoJS.SHA3(user.password).toString();
    var that = this;
    this.http.post('/api/login', user)
    .then(function (response) {
        console.log(response);
        if(response.status !== 401){
          that.rootScope.currentUser = user;
          that.scope.$close();
        }
      },function(rejection){
        that.scope.$dismiss();
    });
  }
}

LoginModalCtrl.$inject = ['$scope', '$rootScope', '$http'];
export default LoginModalCtrl;
