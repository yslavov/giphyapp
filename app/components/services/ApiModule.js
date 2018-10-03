(function () { 'use strict';

	angular.module('ApiModule', [])

	.factory('ApiService', ['$http', '$window',
		function($http, $window){
			var _httpClient = $http;
			var getToken = function(username, password){
				var data = {
					'username': username,
					'password': password
				};
				var promise =  _httpClient.post('/v1/user-login', data);
				return promise;
			};

			var register = function(username, password, name){
				var data = {
					'name': name,
					'username': username,
					'password': password,
					'categories': [],
					'favorites': []
				};
				var promise =  _httpClient.post('/v1/register', data);
				return promise;
			};

			var searchGiphies = function(searchTerm){
				var req = {
					method: 'POST',
					url: '/v1/search-giphies',
					headers: {
						'authtoken': $window.sessionStorage.token || ''
					},
					data: { term: searchTerm }
				}
				var promise =  _httpClient(req);
				return promise;
			};

			var getAccount = function(){
				var req = {
					method: 'GET',
					url: '/v1/account',
					headers: {
						'authtoken': $window.sessionStorage.token || ''
					}
				}
				var promise =  _httpClient(req);
				return promise;
			};

			var addToFavorites = function(favorites){
				var req = {
					method: 'PUT',
					url: '/v1/favorites',
					headers: {
						'authtoken': $window.sessionStorage.token || ''
					},
					data: { favorites: favorites }
				}
				var promise =  _httpClient(req);
				return promise;
			};

			var addNewCategory = function(categories){
				var req = {
					method: 'PUT',
					url: '/v1/categories',
					headers: {
						'authtoken': $window.sessionStorage.token || ''
					},
					data: { categories: categories }
				}
				var promise =  _httpClient(req);
				return promise;
			};

			return {
				getToken: getToken,
				register: register,
				searchGiphies: searchGiphies,
				getAccount: getAccount,
				addToFavorites: addToFavorites,
				addNewCategory: addNewCategory
			};
		}])
	; // end of module
})();
