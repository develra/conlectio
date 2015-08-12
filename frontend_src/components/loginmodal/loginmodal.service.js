'use strict';
class LoginModal {
  constructor($modal, $rootScope){
    this.rootScope = $rootScope;
    this.modal = $modal;
  };

  assignCurrentUser (user) {
    //this.rootScope.currentUser = user;
  return user;
  }

  render() {
    var instance = this.modal.open({
      templateUrl: 'app/main/login.html',
      controller: 'LoginModalCtrl'
    })
    return instance.result.then(this.assignCurrentUser);
  }

}
LoginModal.$inject = ['$modal', '$rootScope'];
export default LoginModal;
