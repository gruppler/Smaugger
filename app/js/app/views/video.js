'use strict';

var VideoView = Backbone.View.extend({
  tagName: 'li',

  initialize: function(){
    this.render();
  },

  render: function(){
    app.render('video', this.$el, this.model.attributes);
  },

  events: {}
});

VideoView.List = Backbone.View.extend({
  el: $('#video-list'),

  initialize: function(){
    _.bindAll(this, 'render', 'append');

    this.views = [];
    this.model.on('reset', this.render);
    this.model.on('add', this.append);
  },

  render: function(){
    _.invoke(this.views, 'remove');
    this.views.length = 0;
    this.model.each(this.append);
  },

  append: function(model){
    var view = new VideoView({ model: model });
    this.views.push(view);
    this.$el.append(view.$el);
  },

  events: {}
});

module.exports = VideoView;
