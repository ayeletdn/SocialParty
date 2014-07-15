$(function() {
	function AdditiveList(options) {
		this.options = options || {};
		
		var	thisClass = this,
			$itemsList = $(options.list),
			$itemsInputList = $itemsList.find('.item_inputs'),
			$lineTemplate = $itemsList.find('.item');
		this.showItemsList = function() {

			// get the list of items
			thisClass.getList().done(function(data) {
				var items = data.results;
				$itemsList.show();

				// an empty list
				if ($.isArray(items) && items.length !== 0) {
					// build the items list
					for (var i in items) {
						thisClass.setItem(items[i].email);
					}
				}

				// line template should have a plus sign and enabled
				$lineTemplate.clone().prependTo($itemsInputList)
							.find('input').prop('disabled', false).addClass('list_add').end()
							.find('span').removeClass('glyphicon-minus').addClass('glyphicon-plus');

				$lineTemplate.hide();
				thisClass.initListActions();
			});

		};
		this.getList = function() {
			return $.get(this.options.url);
		};
		this.setItem = function(item) {
			$lineTemplate.clone(true, true).appendTo($itemsInputList)
						.find('input').val(item).end() // set the value
						.find('.glyphicon-minus').click(this.removeItem).end() // bind remove
						.show();
		};
		this.initListActions = function() {
			$itemsList.find('.glyphicon-plus').click(this.addItem).end()
						.find('.list_add').keypress(this.watchItemInput);
		};
		this.removeItem = function() {
			$(this).parent().remove();
		};
		this.addItem = function() {
			var $this = $(this);
			var $input = $this.is("input") ? $this : $this.parent().find('input');
			thisClass.setItem($input.val());
			$input.val('');
		};
		this.watchItemInput = function(e) {
			if (e.keyCode === 13)
				thisClass.addItem.call(this, e);
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
		advanceStep = function() {
			switch ($('form').attr('data-step')) {
				case 'step_0':
					showGuests();
					break;
				case 'step_1':
					showProducts();
					break;
			}
			var products = new AdditiveList({
				list: '#party_list'
			});
			$('button[name=step_2').click(advanceStep);
		},
		showGuests = function() {
			var guests = new AdditiveList({
				list: '#guest_list',
				url: '/event/guests/'
			});
			guests.showItemsList();
			// advance step
			$('form').attr('data-step', 'step_1');
		},
		showProducts = function() {
			var products = new AdditiveList({
				list: '#party_list',
				url: '/event/products'
			});
			products.showItemsList();
			$('form').attr('data-step', 'step_2');
		},
		initialize = function() {
			initDate();
			initAddressSearch();
			$('button[name=advance_step').click(advanceStep);
		};

	initialize();
});