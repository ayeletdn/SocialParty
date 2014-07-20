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

	eventApp.controller('EventController', ['$scope', 'EventsService', function ($scope, EventsService) {
		ctrlScope = this;
		EventsService.fetchEvents().success(function(events) {
			ctrlScope.eventlist = events;
		});
	}]);
	
})();