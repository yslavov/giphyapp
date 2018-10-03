(function () {'use strict';
  angular.module('appMainModule', ['ngRoute', 'ui.bootstrap', 'ApiModule'])
  .controller('AppController',['$rootScope', '$scope', 'ApiService', '$location', '$window',
    function($rootScope, $scope, apiService, $location, $window){

      $rootScope.inSession = $window.sessionStorage.token ? true : false

      //on page refresh if token load the account data
      if ($rootScope.inSession) {
        apiService.getAccount().then(function(response){
          $scope.categories = response.data.categories
          $scope.favorites = response.data.favorites
        },function(error){ // Error!
          //if session is inactive clean ui and load login page
          if (error.status == 401) {
            $scope.signOut()
          }
        });
      }

      function validateLoginInput(input) {
        if (/^[a-zA-Z0-9]+$/.test(input)) {
          return true
        }
        return false
      };
      function proceedToAccountPage () {
        $location.path('/');
      };
      function setup() {
        $scope.showMobile = false
        $scope.username = undefined
        $scope.usernameMandatory = false
        $scope.password = undefined
        $scope.passwordMandatory = false
        $scope.name = undefined
        $scope.nameMandatory = false
        $scope.isLogin = true;
        $scope.registerSuccess = false
        $scope.searchResults = []
      };
      setup() //call setup immediately after declare to initialize $scope props

      /**
      * use submitLogin to get a token for existing user or register a new user
      */
      $scope.submitLogin = function () {
        // validate name when scenario is registering new user
        if (!$scope.isLogin && (!$scope.name || !validateLoginInput($scope.name))) {
          $scope.nameMandatory = true
          return
        }
        //always validate username and password inputs
        if (!$scope.username || !validateLoginInput($scope.username)) {
          $scope.usernameMandatory = true
          return
        }
        if (!$scope.password || !validateLoginInput($scope.password)) {
          $scope.passwordMandatory = true
          return
        }
        // attempt to login with username and pass after all validations
        if ($scope.isLogin) {
          apiService.getToken($scope.username, $scope.password)
          .then(function(response){ // Success!
            // on success add token to sessionStorage and load user home page
            $window.sessionStorage.token = response.data.token
            proceedToAccountPage()
          },function(error){ // Error!
            //when unauthorized clean inputs in login form and turn them red
            if (error.status == 401) {
              setup()
              $scope.usernameMandatory = true
              $scope.passwordMandatory = true
            }
          })
        //if not login attempt then try registering the user
        } else {
          apiService.register($scope.username, $scope.password, $scope.name)
          .then(function(response){
            setup()
            $scope.registerSuccess = true
          },function(error){
            setup()
            $scope.usernameMandatory = true
            $scope.isLogin = false
          })
        }
      };

      /**
      * handle logout action
      * removes session token, resets UI props, redirects to login page
      */
      $scope.signOut = function(){
        delete($window.sessionStorage.token)
        // setup()
        $location.path( '/login' );
      };

      /**
      * called when search term provided in the search input
      */
      $scope.searchGiphies = function(term){
        return apiService.searchGiphies(term).then(function(response){
          $scope.searchResults = []
          response.data.data.forEach(function(item){
            $scope.searchResults.push(item.embed_url)
          })
        },function(error){ // Error!
          //if session is inactive clean ui and load login page
          if (error.status == 401) {
            $scope.signOut()
          }
        });
      }

      $scope.addToFavorites = function (category, giphy) {
        var favObject = {}
        favObject[category] = giphy
        //do nothing if giphie exists
        if ($scope.favorites.includes(favObject)) {
          return
        }
        $scope.favorites.push(favObject)
        apiService.addToFavorites($scope.favorites).then(function(response){
        },function(error){ // Error!
          //if session is inactive clean ui and load login page
          if (error.status == 401) {
            $scope.signOut()
          }
        });
      };

      //iterate through favorites and match with selected category
      $scope.loadFavorites = function (category) {
        $scope.searchResults = []
        $scope.favorites.forEach(function(item){
          if(Object.keys(item)[0] == category) {
            $scope.searchResults.push(item[category])
          }
        })
      }

      //iterate through favorites and match with selected category
      $scope.addNewCategory = function (categoryName) {
        //do nothing if category exists or not a valid name
        if (!categoryName || $scope.categories.includes(categoryName)) {
          return
        }
        $scope.categories.push(categoryName)
        $scope.categoryName = ""
        apiService.addNewCategory($scope.categories).then(function(response){
        },function(error){ // Error!
          //if session is inactive clean ui and load login page
          if (error.status == 401) {
            $scope.signOut()
          }
        });
      }

    }
  ])
  .config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/login',
      { controller: 'AppController',
      templateUrl: './components/routes/login.html'
      })
    .when('/',
      { controller: 'AppController',
      templateUrl: './components/routes/userpage.html'
      })
    .otherwise({redirectTo:'/login'});
    //remove hash from address
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  })
  .config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading giphy assets domain.
    'https://giphy.com/embed/**'
  ]);
  })
  //on reload go to account page if valid session
  .run(function($location, $window){
    if ($window.sessionStorage.token) {
      $location.path( '/' );
      return
    }
    var urls = [
      'questions-and-answers'
    ]
    for (var i = 0; i < urls.length; i++) {
      if($window.location.href.toLowerCase().includes(urls[i])) {
        return;
      }
    }
    $location.path( '/login' );
  })
  // goClick directive is not used probably can be deprecated
  // .directive( 'goClick', function ( $location ) {
  //   return function ( scope, element, attrs ) {
  //     var path;

  //     attrs.$observe( 'goClick', function (val) {
  //       path = val;
  //     });

  //     element.bind( 'click', function () {
  //       scope.$apply( function () {
  //         $location.path( path );
  //       });
  //     });
  //   };
  // })
})();
