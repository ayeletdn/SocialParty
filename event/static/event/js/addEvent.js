$(function() {
	function Guests() {
		var	thisClass = this,
			guestList = [
				'anativ@gmail.com',
				'eyaldn@gmail.com',
				'figaro@paint.com',
				'picaso@music.com',
				'pigaro@faint.com'
			],
			$guestList = $('#guest_list_inputs'),
			$lineTemplate = $guestList.find('.guest');
		this.showGuestList = function() {
			guests = guestList;

			$('#guest_list').show();

			// an empty guest list
			if ($.isArray(guests) && guests.length !== 0) {
				// build the guest list
				for (var i in guests) {
					thisClass.setGuest(guests[i]);
				}
			}

			// line template should have a plus sign and enabled
			$lineTemplate.clone().prependTo($guestList)
						.find('input').prop('disabled', false).attr('id','guest_list_add').end()
						.find('span').removeClass('glyphicon-minus').addClass('glyphicon-plus');

			$lineTemplate.hide();
			thisClass.initGuestListActions($guestList);
		};
		this.setGuest = function(guest) {
			$lineTemplate.clone(true, true).appendTo($guestList)
						.find('input').val(guest).end() // set the value
						.find('.glyphicon-minus').click(this.removeGuest).end() // bind remove
						.show();
		};
		this.initGuestListActions = function($guestList) {
			$guestList.find('.glyphicon-plus').click(this.addGuest).end()
						.find('#guest_list_add').keypress(this.watchGuestInput);
		};
		this.removeGuest = function() {
			$(this).parent().remove();
		};
		this.addGuest = function() {
			var $this = $(this);
			var $input = $this.is("input") ? $this : $this.parent().find('input');
			thisClass.setGuest($input.val());
			$input.val('');
		};
		this.watchGuestInput = function(e) {
			if (e.keyCode === 13)
				thisClass.addGuest.call(this, e);
		};
	}
	var	initDate = function() {
			$('#id_date').datepicker();
		},
		initAddressSearch = function() {
			var searchBox = new google.maps.places.SearchBox(
					document.getElementById('id_place')
				);
		},
		initialize = function() {
			initDate();
			initAddressSearch();
			var guests = new Guests();
			$('button[name=step_1').click(guests.showGuestList);
		};

	initialize();
});