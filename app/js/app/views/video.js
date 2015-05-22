'use strict';

var VideoView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function(){
    var that = this;

    this.model.on('destroy', function(){
      var views = app.view.videos.views;

      that.remove();
      views.splice(views.indexOf(that), 1);
    });

    this.$el.data('model', this.model);
    this.render();
  },

  render: function(){
    var attr = _.clone(this.model.attributes);

    attr.size = sizeOf(attr.size);
    app.render('video', this.$el, attr);
  },

  events: {
    'click button.delete': 'delete'
  },

  delete: function(){
    this.model.destroy();
  }
});

VideoView.List = Backbone.View.extend({
  el: $('#video-list-content'),

  initialize: function(){
    _.bindAll(this, 'render', 'append', 'change_group_regex');

    this.views = [];
    this.model.on('reset', this.render);
    this.model.on('add', this.append);
    $window.on('change_group_regex', this.change_group_regex);
  },

  render: function(){
    _.invoke(this.views, 'remove');
    this.views.length = 0;
    this.model.each(this.append);
  },

  append: function(model){
    var view = new VideoView({ model: model })
      , group = model.group()
      , prev, prev_group;

    if(group === null){
      view.$el.addClass('disabled');
      view.is_even = false;
    }else if(this.views.length){
      prev = this.views[this.views.length - 1];
      prev_group = prev.model.group();

      if(_.isEqual(group, prev_group)){
        view.$el.addClass(prev.is_even ? 'even' : 'odd');
        view.is_even = prev.is_even;
      }else{
        view.$el.addClass(prev.is_even ? 'odd' : 'even');
        view.is_even = !prev.is_even;
      }
    }else{
      view.$el.addClass('even');
      view.is_even = true;
    }
    this.views.push(view);
    this.$el.append(view.$el);
  },

  change_group_regex: function(){
    var i, view, prev, group, prev_group;

    for(i = 0; i < this.views.length; i++){
      view = this.views[i];
      group = view.model.group();

      view.$el.removeClass('disabled even odd');

      if(group === null){
        view.$el.addClass('disabled');
        view.is_even = false;
      }else if(i > 0){
        prev = this.views[i - 1];
        prev_group = prev.model.group();

        if(_.isEqual(group, prev_group)){
          view.$el.addClass(prev.is_even ? 'even' : 'odd');
          view.is_even = prev.is_even;
        }else{
          view.$el.addClass(prev.is_even ? 'odd' : 'even');
          view.is_even = !prev.is_even;
        }
      }else{
        view.$el.addClass('even');
        view.is_even = true;
      }
    }

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
