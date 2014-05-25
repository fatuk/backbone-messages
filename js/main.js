var Person = Backbone.Model.extend({
    defaults: {
        name: 'No name',
        age: 30
    }
});

var PeopleCollection = Backbone.Collection.extend({
    model: Person
});

var DialogCollection = Backbone.Collection.extend({
    url: 'data/people.json',
    initialize: function() {
        this.fetch({
            reset: true
        });
    }
});

var PersonView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {

    },
    template: $('#dialogTemplate').html(),
    render: function() {
        this.$el.html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    }
});

var PeopleView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.render();
    },
    template: $('#peopleTemplate').html(),
    render: function() {
        this.collection.each(function(person) {
            var personView = new PersonView({
                model: person
            });
            this.$el.append(personView.render().el);
        }, this);
        $('body').html(this.$el);
    },
    addOne: function(person) {
        var personView = new PersonView({
            model: person
        });
        this.$el.append(personView.render().el);
    }
});

var person = new Person();

var peopleCollection = new PeopleCollection([{
    name: 'Andrew',
    age: 27
}, {
    name: 'Kukka',
    age: 37
}, {
    name: 'Sonia',
    age: 14
}]);

var dialogCollection = new DialogCollection();
dialogCollection.on('reset', function() {
    var peopleView = new PeopleView({
        collection: dialogCollection
    });
});

/*var peopleView = new PeopleView({
    collection: peopleCollection
});*/