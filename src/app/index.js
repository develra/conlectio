'use strict';

import NavbarCtrl from '../components/navbar/navbar.controller';
import SidebarCtrl from '../components/sidebar/sidebar.controller';
import PreviewCtrl from '../components/preview/preview.controller';

angular.module('conlect', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ngDraggable', 'smart-table'])
  .factory('Shared_Data', function () {
    return []
  })
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('SidebarCtrl', SidebarCtrl)
  .controller('PreviewCtrl', PreviewCtrl)
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
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html'
      });
  $urlRouterProvider.otherwise('/');
});
