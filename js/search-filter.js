var InputSearchView = Backbone.View.extend({
	template: $('#searchInputTemplate').html(),
	initialize: function () {
		this.render();
	},
	events: {
		'keyup #searchInput': 'filterList'
	},
	filterList: function (e) {
		filtered = itemCollection.where({
			name: $(e.currentTarget).val()
		});

		var filteredListCollection = new FilteredListCollection(filtered);
		console.log(filteredListCollection);

		var listView = new ListView({
			collection: filteredListCollection
		});
	},
	render: function () {
		var rendered = Mustache.render(this.template, {});
		this.$el.html(rendered);
		$('.js-search').append(this.el);
	}
});

var ItemCollection = Backbone.Collection.extend({
	url: 'data/items.json',
	initialize: function () {
		this.fetch({
			reset: true
		});
	}
});




var FilteredListCollection = Backbone.Collection.extend({});
// var filteredListCollection = new FilteredListCollection();

var ItemView = Backbone.View.extend({
	template: $('#listItemTemplate').html(),
	tagName: 'li',
	render: function () {
		var rendered = Mustache.render(this.template, this.model.toJSON());
		this.$el.html(rendered);
		return this;
	}
});

var ListView = Backbone.View.extend({
	tagName: 'ul',
	initialize: function () {
		this.render();
	},
	render: function () {
		this.collection.on('reset', function () {
			this.collection.each(function (item) {
				var itemView = new ItemView({
					model: item
				});
				this.$el.append(itemView.render().el);
			}, this);
			$('.js-search').append(this.el);
		}, this);
	}
});

var itemCollection = new ItemCollection();
var inputSearchView = new InputSearchView();
var listView = new ListView({
	collection: itemCollection
});