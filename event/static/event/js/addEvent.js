$(function() {
	var	guestList = [
			'anativ@gmail.com',
			'eyaldn@gmail.com',
			'figaro@paint.com',
			'picaso@music.com'
		],
		initDate = function() {
			$('#id_date').datepicker();
		},
		initAddressSearch = function() {
			var searchBox = new google.maps.places.SearchBox(
					document.getElementById('id_place')
				);
		},
		showGuestList = function() {
			guests = guestList;

			var $source = $('#source_guest_list');
			var $lineTemplate = $source.find('li');
			$('#guest_list').show();

			// an empty guest list
			if (!$.isArray(guests) || guests.length === 0) {
				$lineTemplate.text('List is empty');
				return;
			}

			// remove the template
			$lineTemplate.remove();
			// build the guest list
			for (i in guests) {
				$lineTemplate.clone().text(guests[i]).appendTo($source);
			}
		},
		initialize = function() {
			initDate();
			initAddressSearch();
			$('button[name=step_1').click(showGuestList);
		};

	initialize();
});