// Search input view
var InputSearchView = Backbone.View.extend({
	quiteMillis: 1000,
	searchFilterParamName: 'search',
	template: $('#searchInputTemplate').html(),
	initialize: function () {
		this.render();
	},
	events: {
		'keyup #searchInput': 'filterList'
	},
	keyUpTimeout: null,
	filterList: function (e) {
		var view = this;
		clearTimeout(this.keyUpTimeout);
		this.keyUpTimeout = setTimeout(function () {
			dialogsCollection.url = $('#searchInputTemplate').data('url') + '?' + view.searchFilterParamName + '=' + $(e.currentTarget).val();
			dialogsCollection.fetch({
				reset: true
			});
			dialogsView.$el.html('');
		}, view.quiteMillis);
	},
	render: function () {
		var rendered = Mustache.render(this.template, {});
		this.$el.html(rendered);
		$('#search').html(this.el);
	}
});

var DialogsCollection = Backbone.Collection.extend({
	url: $('.js-dialog').data('url'),
	initialize: function () {
		this.fetch({
			reset: true
		});
	}
});

var dialogsCollection = new DialogsCollection();

var DialogsItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'chat__dialogs-item',
	template: $('#dialogsItemTemplate').html(),
	render: function () {
		var rendered = Mustache.render(this.template, this.model.toJSON());
		this.$el.html(rendered);
		return this;
	}
});

var DialogView = Backbone.View.extend({
	template: $('#dialogTemplate').html(),
	initialize: function () {
		this.render();
	},
	render: function () {
		var rendered = Mustache.render(this.template, this.model.toJSON());
		$('.js-dialog').html(rendered);
	}
});

var DialogsView = Backbone.View.extend({
	tagName: 'ul',
	className: 'chat__dialogs-list',
	initialize: function () {
		_.bindAll(this, 'renderDialog');
		this.render();
	},
	events: {
		'click .js-dialogsItem': 'renderDialog'
	},
	render: function () {
		// Collection is ready
		this.collection.on('reset', function () {
			this.collection.each(function (dialogsItem) {
				var dialogsItemView = new DialogsItemView({
					model: dialogsItem
				});
				this.$el.append(dialogsItemView.render().el);
			}, this);
			$('.js-dialogs').append(this.el);

			// set first active
			this.$el.find('.js-dialogsItem:first').trigger('click');

			// render search input
			var inputSearchView = new InputSearchView({
				collection: this.collection
			});
		}, this);
	},
	renderDialog: function (e) {
		$('.js-dialogsItem').removeClass('active');
		$(e.currentTarget).addClass('active');

		var Dialog = Backbone.Model.extend({
			url: $(e.currentTarget).data('url'),
			initialize: function () {
				this.fetch({
					reset: true
				});
			}
		});
		var dialog = new Dialog();
		dialog.on('change', function () {
			var dialogView = new DialogView({
				model: dialog
			});
		});
	}
});

var dialogsView = new DialogsView({
	collection: dialogsCollection
});