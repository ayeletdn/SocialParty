(function() {

	var editEventApp = angular.module('editevent', ['ngRoute', 'ngAutocomplete'])
					.config(function ($routeProvider, $httpProvider) {
						// Send out CSRF Token
						$httpProvider.defaults.xsrfCookieName = 'csrftoken';
						$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

						// Configure the router
						$routeProvider
							.when('/:eventId?', {
								templateUrl: '/static/event/views/edit.html',
								controller: 'EditEventController'
							});
						});

	/**
	 * Event Service
	 * @param  {[type]} $http [description]
	 * @return {[type]}       [description]
	 */
	editEventApp.factory('EditEvent', function ($http) {
		return {
			fetchEvent: function(eventid) {
				// if no event id given, return an empty object
				if (!eventid)
					return {};
				// get the event for editing
				return $http.get('/event/' + eventid);
			},
			saveEvent: function(eventid, eventdata) {
				if (eventid)
					return $http.put('/event/' + eventid, eventdata);
				else
					return $http.post('/event/add/', eventdata);
			},
			validateEvent: function(eventData) {
				console.log('validateEvent ', eventData);
				return true;
			}
		};
	});

	/**
	 * List Service
	 * @param  {[type]} $http [description]
	 * @return {[type]}       [description]
	 */
	editEventApp.factory('ListService', function ($http) {
		return {
			/**
			 * Add a new item to the list
			 * @param  {String} url The base URL for the list
			 * @return {Promise}    A promise object to use when action is executed
			 */
			addItem: function(url, data) {
				return $http.post(url, data);
			},
			/**
			 * Remove an item from the list
			 * @param  {String} url The base URL for the list
			 * @param  {String} id The items's id
			 * @return {Promise}    A promise object to use when action is executed
			 */
			removeItem: function(url, id) {
				return $http.delete(url + id);
			},

			/**
			 * Get the list of items
			 * @param  {String} url The base URL for the list
			 * @return {Promise}    A promise object to use when action is executed
			 */
			getItems: function(url) {
				return $http.get(url);
			}
		};
	});

	/**
	 * Event Controller
	 * @param  {[type]} $scope       [description]
	 * @param  {[type]} $log         [description]
	 * @param  {[type]} $routeParams [description]
	 * @param  {[type]} EditEvent    [description]
	 * @return {[type]}              [description]
	 */
	editEventApp.controller('EditEventController', ['$scope', '$log', '$routeParams', 'EditEvent', function ($scope, $log, $routeParams, EditEvent) {
		var eventid = $routeParams.eventId; // event ID, if requested
		var eventStates = {
			NEW: 0,
			BASIC: 1,
			HAS_GUESTS: 2
		};
		var validateGuest = function(data) {
			$log.debug(data);
			return true;
		};

		$scope.event = {}; // The event data

		// Form UI management
		// The form's stage - if event defined, by ready to save, otherwise, start from the top
		$scope.stage = eventid !== undefined ? eventStates.HAS_GUESTS : eventStates.NEW;

		// Load the event 
		if (eventid) {
			EditEvent.fetchEvent(eventid).success(function(eventData) {
				$scope.event = eventData;

				// if no data found, start from scratch
				if (!EditEvent.validateEvent(eventData)) $scope.stage = eventStates.NEW;
			});
		}

		// Init the two lists
		$scope.guests = {
			show: false,
			id: 'guest',
			url: '/event/guests/',
			validate: validateGuest,
			items: []
		};
		$scope.products = {
			show: false,
			id: 'product',
			url: '/event/products/',
			items: []
		};

		/**
		 * Continue in the form stages 
		 */
		$scope.continue = function() {
			switch ($scope.stage) {
				case eventStates.NEW:
					// TODO: Validste
					if (EditEvent.validateEvent($scope.event)) {
						$scope.guests.show = true;
						$scope.stage = eventStates.BASIC;
					}
					break;
				case eventStates.BASIC:
					// TODO: Validste
					$scope.products.show = true;
					$scope.stage = eventStates.HAS_GUESTS;
					break;
				case eventStates.HAS_GUESTS:
					// TODO: Validste
					EditEvent.saveEvent(eventData);
					break;
			}
		};
	}]);

	// A directive to handle the date time input
	editEventApp.directive('datetimeInput', function() {
		function link(scope, element, attrs) {
			$(element).datepicker();
		}

		return {
			link: link
		};
	});

	// A directive to handle the location item_inputs
	// Not working. Asked Question on StackOverflow:
	// http://stackoverflow.com/questions/24949545/error-from-google-maps-api-when-in-an-angular-directive
	editEventApp.directive('locationInput', function() {
		function link(scope, element, attrs) {
			scope.searchBox = new google.maps.places.SearchBox(element);
			console.log(scope.searchBox);
		}

		return {
			link: link
		};
	});

	// A directive to handle an items list
	editEventApp.directive('itemsList', ['$log', 'ListService', function($log, ListService) {

		var service = ListService;

		var link = function(scope, element, attrs) {
			var list = scope.list;
			// get the items and store them in the scope
			service.getItems(scope.list.url)
				.success(function addSuccess(data, status, headers, config) {
					list.items = data.results;
				})
				.error(function addFailure(data, status, headers, config) {
					$log.error('getItems failure', {'data': data, 'status': status, 'headers': headers, 'config': config});
				});
		};

		return {
			restrict: 'E',
			scope: {
				list: '=',
				title: '@'
			},
			templateUrl: '/static/event/directives/itemlist.html',
			link: link
		};
	}]);

	/**
	 * A directive to add an item to a list
	 * 
	 * @param  {Service} $log        The AngularJS log service
	 * @param  {Service} ListService The list service, which manages items
	 */
	editEventApp.directive('addItem', ['$log', 'ListService', function($log, ListService) {
		var service = ListService;

		var link = function(scope, element, attrs) {
			// keep the list on scope
			var itemsList = scope.list;

			function add(scope, e) {
				$log.debug('Add item');
				// validate
				if ('validate' in itemsList && !itemsList.validate(scope.value))
					return $log.error('Invalid item', scope.value);

				// send to server
				service.addItem(itemsList.url, {email: scope.value, name: 'my name', user: 1})
					.success(function addSuccess(data, status, headers, config) {
						// store the data in the array
						itemsList.items.push(data);
						// clear the input
						scope.value = '';
					})
					.error(function addFailure(data, status, headers, config) {
						$log.error('Add item failure', {'data': data, 'status': status, 'headers': headers, 'config': config});
					});
			}

			// Bind click event according to type
			var action = element.find('span');
			action.bind('click', add.bind(element, scope));
		};

		return {
			restrict: 'E',
			templateUrl: '/static/event/directives/additem.html',
			link: link
			
		};
	}]);

	/**
	 * The item directive. 
	 * 
	 * @param  {Service} $log        The AngularJS log service
	 * @param  {Service} ListService The list service, which manages items
	 */
	editEventApp.directive('item', ['$log', 'ListService', function($log, ListService) {
		var service = ListService;

		var link = function(scope, element, attrs) {
			var itemsList = scope.$parent.list;

			function remove(scope, e) {
				$log.debug('Remove item');
				service.removeItem(itemsList.url, scope.item.id)
					.success(function removeSuccess(data, status, headers, config) {
						// remove the item from the list
						itemsList.items.splice(scope.index, 1);
					})
					.error(function removeFailure(data, status, headers, config) {
						$log.error('Remove item failure', {'data': data, 'status': status, 'headers': headers, 'config': config});
					});
			}

			// Bind click event according to type
			var action = element.find('span');
			action.bind('click', remove.bind(element, scope));
		};

		return {
			restrict: 'E',
			templateUrl: '/static/event/directives/item.html',
			scope: {
				index: '@',
				item: '='
			},
			link: link
			
		};
	}]);

})();