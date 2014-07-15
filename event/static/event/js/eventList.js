(function() {
	var eventApp = angular.module('event', []);

	/**
	 * Services for the Event app
	 * @param  {service} $http a core Angular service 
	 *                         that facilitates communication with the remote HTTP servers 
	 *                         via the browser's XMLHttpRequest object or via JSONP.
	 * @return {EventsService} a class that provides connection services to the server
	 */
	eventApp.factory('EventsService', function ($http) {
		return {
			fetchEvents: function () {
				return $http.get('/event/list/');
			}
		};
	});

	eventApp.controller('EventController', function ($scope, EventsService) {
		$scope = this;
		EventsService.fetchEvents().success(function(events) {
			$scope.eventlist = events;
		});
	});

	// eventApp.controller('EventController', function() {
	// this.eventlist = preEvents;
	// });

	var preEvents = [
		{ id: 1, name: 'Alvin'},
		{ id: 2, name: 'Simon'},
		{ id: 3, name: 'Theodore'},
	];
})();