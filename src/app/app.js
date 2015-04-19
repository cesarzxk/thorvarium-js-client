angular.module( 'thorvarium', [
  'templates-app',
  'templates-common',
  'thorvarium.home',
  'thorvarium.login',
  'thorvarium.chat',
  'thorvarium.game.bullet',
  'thorvarium.game.person',
  'thorvarium.game.loop',
  'thorvarium.game',
  'ui.bootstrap',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $rootScope, $scope, $location ) {
  
  $scope.go = function ( path ) {
    $location.path( path );
  };

  $scope.logout = function () {

    if(angular.isDefined($.cookie('auth'))) {

      var data = {auth: $.cookie('auth') };
      $.post(apiUrl + '/logout', data, function(result) {
        
        $.removeCookie('auth');
        $.removeCookie('user');

        $scope.$apply(function() {
          $scope.go('/login');
        });

      }).fail($scope.errorHandler);
    
    } else {
      $scope.go('/login');
    }
  };

  $scope.errorHandler = function(error) {
        
    error = angular.isDefined(error.responseText) ? $.parseJSON(error.responseText) : {};
    if (angular.isDefined(error.cause)) {

      if (error.cause === 'user_not_found') {
        alert('User not found!');
      } else if (error.cause === 'invalid_params') {
        alert('Invalid params!');
      }

    } else {
      alert('Some error occured, please try again!');
    }
  };
  
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (angular.isDefined( toState.data.pageTitle)) {
      $scope.pageTitle = toState.data.pageTitle + ' | Thorvarium';
    }
  });

  if(angular.isDefined($.cookie('user'))) {
    $rootScope.user = $.parseJSON($.cookie('user'));
  }

  $rootScope.ws = null;

})

;

