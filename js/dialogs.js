var DialogsCollection = Backbone.Collection.extend({
    url: 'data/dialogs.json',
    initialize: function() {
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
    render: function() {
        var rendered = Mustache.render(this.template, this.model.toJSON());
        this.$el.html(rendered);
        return this;
    }
});

var DialogView = Backbone.View.extend({
    template: $('#dialogTemplate').html(),
    initialize: function() {
        this.render();
    },
    render: function() {
        var rendered = Mustache.render(this.template, this.model.toJSON());
        $('.js-dialog').html(rendered);
    }
});

var DialogsView = Backbone.View.extend({
    tagName: 'ul',
    className: 'chat__dialogs-list js-dialogsItem',
    initialize: function() {
        _.bindAll(this, 'renderDialog');
        this.render();
    },
    events: {
        'click .js-dialogsItem': 'renderDialog'
    },
    render: function() {
        this.collection.on('reset', function() {
            this.collection.each(function(dialogsItem) {
                var dialogsItemView = new DialogsItemView({
                    model: dialogsItem
                });
                this.$el.append(dialogsItemView.render().el);
            }, this);
            $('.js-dialogs').html(this.el);
        }, this);
    },
    renderDialog: function(e) {
        $('.js-dialogsItem').removeClass('active');
        $(e.currentTarget).addClass('active');

        var Dialog = Backbone.Model.extend({
            url: $(e.currentTarget).data('url'),
            initialize: function() {
                this.fetch({
                    reset: true
                });
            }
        });
        var dialog = new Dialog();
        dialog.on('change', function() {
            var dialogView = new DialogView({
                model: dialog
            });
        });
    }
});

var dialogsView = new DialogsView({
    collection: dialogsCollection
});