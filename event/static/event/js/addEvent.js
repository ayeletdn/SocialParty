(function() {

	var editEventApp = angular.module('editevent', ['ngRoute', 'ngAutocomplete'])
					.config(function ($routeProvider) {
						$routeProvider
							.when('/:eventId?', {
								templateUrl: '/static/event/views/edit.html',
								controller: 'EditEventController'
							});
						});

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

	editEventApp.factory('ListService', function ($http) {
		return {
			/**
			 * Add a new item to the list
			 * @param {Object} data The data of the item to add
			 */
			addItem: function(url, data) {
				return $http.post(url, data);
			},
			/**
			 * Remove an item from the list
			 * @param  {String} id The items's id
			 * @return {Promise}    A promise object to use when action is executed
			 */
			removeItem: function(url, id) {
				return $http.delete(url + '/' + id);
			}
		};
	});

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

		$scope.guests = {show: false, id: 'guest', url: '/event/guests', validate: validateGuest, items: [
			{email: 'ayelet@gmail.com'},
			{email: 'eyal@gmail.com'}
		]};
		$scope.products = {show: false, id: 'product', url: '/event/products'};

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
	editEventApp.directive('itemsList', ['ListService', function(ListService) {

		return {
			restrict: 'E',
			scope: {
				list: '=',
				title: '@'
			},
			templateUrl: '/static/event/directives/itemlist.html'
		};
	}]);

	editEventApp.directive('addItem', ['$log', 'ListService', function($log, ListService) {
		var service = ListService;

		var link = function(scope, element, attrs) {
			var parentObj = scope.list;

			function add(scope, e) {
				$log.debug('Add item');
				if (!parentObj.validate(scope.value))
					return $log.error('Invalid item', scope.value);
				service.addItem(parentObj.url, scope.value)
					.success(function addSuccess(data, status, headers, config) {
						$log.debug('addSuccess', data);
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

	editEventApp.directive('item', ['$log', 'ListService', function($log, ListService) {
		var service = ListService;

		var link = function(scope, element, attrs) {
			var parentObj = scope.$parent.list;

			function remove(scope, e) {
				$log.debug('Remove item');
				service.removeItem(parentObj.url, scope.index)
					.success(function removeSuccess(data, status, headers, config) {
						$log.info('Remove item success', data);
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

	// function AdditiveList(options) {
	// 	this.options = options || {};
		
	// 	var	thisClass = this,
	// 		$itemsList = $(options.list),
	// 		$itemsInputList = $itemsList.find('.item_inputs'),
	// 		$lineTemplate = $itemsList.find('.item');
	// 	this.showItemsList = function() {

	// 		// get the list of items
	// 		thisClass.getList().done(function(data) {
	// 			var items = data.results;
	// 			$itemsList.show();

	// 			// an empty list
	// 			if ($.isArray(items) && items.length !== 0) {
	// 				// build the items list
	// 				for (var i in items) {
	// 					thisClass.setItem(items[i].email);
	// 				}
	// 			}

	// 			// line template should have a plus sign and enabled
	// 			$lineTemplate.clone().prependTo($itemsInputList)
	// 						.find('input').prop('disabled', false).addClass('list_add').end()
	// 						.find('span').removeClass('glyphicon-minus').addClass('glyphicon-plus');

	// 			$lineTemplate.hide();
	// 			thisClass.initListActions();
	// 		});

	// 	};
	// 	this.getList = function() {
	// 		return $.get(this.options.url);
	// 	};
	// 	this.setItem = function(item) {
	// 		$lineTemplate.clone(true, true).appendTo($itemsInputList)
	// 					.find('input').val(item).end() // set the value
	// 					.find('.glyphicon-minus').click(this.removeItem).end() // bind remove
	// 					.show();
	// 	};
	// 	this.initListActions = function() {
	// 		$itemsList.find('.glyphicon-plus').click(this.addItem).end()
	// 					.find('.list_add').keypress(this.watchItemInput);
	// 	};
	// 	this.removeItem = function() {
	// 		$(this).parent().remove();
	// 	};
	// 	this.addItem = function() {
	// 		var $this = $(this);
	// 		var $input = $this.is("input") ? $this : $this.parent().find('input');
	// 		thisClass.setItem($input.val());
	// 		$input.val('');
	// 	};
	// 	this.watchItemInput = function(e) {
	// 		if (e.keyCode === 13)
	// 			thisClass.addItem.call(this, e);
	// 	};
	// }
	// var	initDate = function() {
	// 		$('#id_date').datepicker();
	// 	},
	// 	initAddressSearch = function() {
	// 		var searchBox = new google.maps.places.SearchBox(
	// 				document.getElementById('id_place')
	// 			);
	// 	},
	// 	advanceStep = function() {
	// 		switch ($('form').attr('data-step')) {
	// 			case 'step_0':
	// 				showGuests();
	// 				break;
	// 			case 'step_1':
	// 				showProducts();
	// 				break;
	// 		}
	// 		var products = new AdditiveList({
	// 			list: '#party_list'
	// 		});
	// 		$('button[name=step_2').click(advanceStep);
	// 	},
	// 	showGuests = function() {
	// 		var guests = new AdditiveList({
	// 			list: '#guest_list',
	// 			url: '/event/guests/'
	// 		});
	// 		guests.showItemsList();
	// 		// advance step
	// 		$('form').attr('data-step', 'step_1');
	// 	},
	// 	showProducts = function() {
	// 		var products = new AdditiveList({
	// 			list: '#party_list',
	// 			url: '/event/products'
	// 		});
	// 		products.showItemsList();
	// 		$('form').attr('data-step', 'step_2');
	// 	},
	// 	initialize = function() {
	// 		initDate();
	// 		initAddressSearch();
	// 		$('button[name=advance_step').click(advanceStep);
	// 	};

	// initialize();
})();