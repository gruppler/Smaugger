'use strict';

var VideoView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function(){
    var that = this;

    _.bindAll(this, 'render', 'update_name', 'update_duration', 'edit_name');

    this.model.on('destroy', function(){
      var views = app.view.videos.views;

      that.remove();
      views.splice(views.indexOf(that), 1);
    });

    this.$el.data('model', this.model);
    this.render();
  },

  render: function(){
    var that = this
      , attr = _.clone(this.model.attributes);

    this.model.on('change:name', this.update_name);
    this.model.on('change:duration', this.update_duration);

    attr.size = sizeOf(attr.size);
    attr.duration = duration(attr.duration);

    app.render('video', this.$el, attr, function(){
      that.$video = that.$('video');
      that.video = that.$video[0];

      that.$video.on('timeupdate', function(){
        that.update_duration(that.video.currentTime);
      });

      if(!that.model.has('duration')){
        that.$video.on('loadedmetadata', function(){
          that.model.save('duration', this.duration);
        });
      }
    });
  },

  update_name: function(){
    this.$('.name').html(this.model.get('name'));
    $window.trigger('change_group_regex');
  },

  update_duration: function(time){
    time = _.isNumber(time) ? time : this.model.get('duration');
    this.$('.duration').html(duration(time));
  },

  events: {
    'click button.delete': 'delete',
    'click .name': 'edit_name',
    'click video': 'play_pause_video',
    'contextmenu video': 'fullscreen_video'
  },

  delete: function(){
    this.model.destroy();
  },

  edit_name: function(){
    app.view.edit(this.model, 'name', this.$('.name'));
  },

  play_pause_video: function(){
    if(this.video.paused){
      if(app.view.playing){
        app.view.playing.pause();
      }
      this.video.play();
      app.view.playing = this.video;
    }else{
      this.video.pause();
      app.view.playing = null;
    }
  },

  fullscreen_video: function(){
    this.video.webkitRequestFullscreen();
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

  append: function(model, order){
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
    if(_.isNumber(order)){
      this.$el.appendAt(view.$el, order);
    }else{
      this.$el.append(view.$el);
    }
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

function duration(seconds){
  var h, m, s;

  h = Math.floor(seconds/3600) || 0;
  m = Math.floor(seconds/60) || 0;
  s = Math.floor(seconds % 60) || 0;

  if(h < 10){
    h = '0'+h;
  }
  if(m < 10){
    m = '0'+m;
  }
  if(s < 10){
    s = '0'+s;
  }

  return h+':'+m+':'+s;
}

module.exports = VideoView;
