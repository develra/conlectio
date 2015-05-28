'use strict';

import NavbarCtrl from '../components/navbar/navbar.controller';
import SidebarCtrl from '../components/sidebar/sidebar.controller';
import PreviewCtrl from '../components/preview/preview.controller';
import AdminSidebarCtrl from '../components/adminsidebar/adminsidebar.controller';
import AdminNavbarCtrl from '../components/adminnavbar/adminnavbar.controller';

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
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('SidebarCtrl', SidebarCtrl)
  .controller('PreviewCtrl', PreviewCtrl)
  .controller('AdminSidebarCtrl', AdminSidebarCtrl)
  .controller('AdminNavbarCtrl', AdminNavbarCtrl)
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
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/main/admin.html'
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html'
      });
  $urlRouterProvider.otherwise('/');
  //if supported, make the URL pretty
   if(window.history && window.history.pushState){
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
        });
   }
});
