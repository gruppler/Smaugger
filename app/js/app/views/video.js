'use strict';

var VideoView = Backbone.View.extend({
  tagName: 'li',

  initialize: function(){
    var that = this;

    this.model.on('destroy', function(){
      var views = app.view.videos.views;

      that.remove();
      views.splice(views.indexOf(that), 1);
    });

    this.render();
  },

  render: function(){
    var attr = _.clone(this.model.attributes);

    attr.size = sizeOf(attr.size);
    app.render('video', this.$el, attr);
    this.$('video').on('loadedmetadata', function(){
      console.log(this.duration);
    });
  },

  events: {
    'click button.delete': 'delete'
  },

  delete: function(){
    this.model.destroy();
  }
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

function sizeOf(bytes){
  if(!bytes){
    return '0.00 B';
  }
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes/Math.pow(1024, e)).toFixed(2)+' '+' KMGTP'.charAt(e)+'B';
}

module.exports = VideoView;
