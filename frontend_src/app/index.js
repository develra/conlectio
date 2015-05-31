'use strict';

import NavbarCtrl from '../components/navbar/navbar.controller';
import SidebarCtrl from '../components/sidebar/sidebar.controller';
import PreviewCtrl from '../components/preview/preview.controller';
import AdminSidebarCtrl from '../components/adminsidebar/adminsidebar.controller';
import AdminNavbarCtrl from '../components/adminnavbar/adminnavbar.controller';
import LoginModalCtrl from '../components/loginmodal/loginmodal.controller';
import LoginModal from '../components/loginmodal/loginmodal.service';

angular.module('conlect', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'lrDragNDrop', 'smart-table'])
  .factory('Shared_Data', function ($http) {
    var sharedObj = [];
    $http.get('/api/viewdata')
      .success(function(data) {
        for(let i = 0; i<data.length; i++){
          data[i].active = false;
          data[i].userMaps = [];
          sharedObj.push(data[i]);
        }
      })
      .error(function(data, status) {
        console.log(data + ' failed with code ' + status);
      });
      return sharedObj;
  })
  .service('loginModal', LoginModal)
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('SidebarCtrl', SidebarCtrl)
  .controller('PreviewCtrl', PreviewCtrl)
  .controller('AdminSidebarCtrl', AdminSidebarCtrl)
  .controller('AdminNavbarCtrl', AdminNavbarCtrl)
  .controller('LoginModalCtrl', LoginModalCtrl)
  .filter('unique', function() {
    return function (arr, field) {
      var o = {}, i, l = arr.length, r = [];
      for(i=0; i<l;i+=1)
        o[arr[i][field]] = arr[i];
      for(i in o)
        r.push(o[i]);
      return r;
    };
  })
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    //Prompt a login if server returns 401 on a request
    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
      var loginModal, $http, $state;
      $timeout(function () {
        loginModal = $injector.get('loginModal');
        $http = $injector.get('$http');
        $state = $injector.get('$state');
      });
      return {
        responseError: function (rejection) {
          if (rejection.status !== 401) {
            return rejection;
          }
          var deferred = $q.defer();
          loginModal()
            .then(function () {
              deferred.resolve( $http(rejection.config) );
            })
            .catch(function () {
              $state.go('welcome');
              deferred.reject(rejection);
            });
        return deferred.promise;
      }
    };
  });
    //Routes
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/main/login.html',
        data: {
          requireLogin: false
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/main/admin.html',
        data: {
          requireLogin: true
        }
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        data: {
          requireLogin: false
        }
      });
  $urlRouterProvider.otherwise('/');
  //if supported, make the URL pretty
   if(window.history && window.history.pushState){
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
        });
   }
})
//we are doing 'fake' route authentication here, as is rendered on the frontend all pages are
//technically viewable, mostly just a way to force admin login so we can authenticate
//admin-only api requests
.run(function ($rootScope, $state, loginModal) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (requireLogin && typeof $rootScope.currentUser === 'undefined'){
      event.preventDefault();
      loginModal.render()
        .then(function () {
          return $state.go(toState, toParams);
        })
        .catch(function () {
          return $state.go('home');
        });
    }
  })
});
