var app = angular.module('app', ['ngRoute', 'ngResource']).constant('config');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'AuthCtrl'
        })
        .when('/messages', {
            templateUrl: 'messages.html',
            controller: 'MessageCtrl'
        })
}]);


app.factory('AuthService', ['$resource', function($resource) {
  return $resource('/checkauth'); 
}]);

app.factory('MessageService', ['$resource', function($resource) {
    return $resource('/twitter/inbox', {}, {
        query: {
            method: 'GET', 
            isArray: false
        }
    });
}]);

app.controller('AuthCtrl', ['$scope', '$rootScope', 'AuthService', function($scope, $rootScope, auth) {
    auth.get(function(data, headers) {
        if (data.hasOwnProperty('auth')) {
            if (data.auth == false) {
                $rootScope.isLoggedin = false;
            }
        } else {
            $rootScope.isLoggedin = true;
            $scope.username = data.profile.username;
        }
    });
}]);

app.controller('MessageCtrl', ['$scope', 'MessageService', function($scope, message) {
    message.query(function(data, headers) {
        console.log(data);
        
        $scope.messages = JSON.parse(data.messages);
    })
}]);

app.factory('TeamService', ['$resource', function ($resource) {
    return $resource('/teams/:teamId');
}]);

app.directive('imageFallback', function() {
    return {
        link: function(scope, elem, attrs) {
            elem.bind('error', function() {
               angular.element(this).attr('src', attrs.imageFallback); 
            });
        }
    }
});




function _handleError(response) {
    // Todo: redirect to error page
    console.log('%c ' + response, 'color: red');
    
}
