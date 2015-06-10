'use strict';

var filetype_regex = /^video\//;

var Video = Backbone.Model.extend({
  defaults: {},

  localStorage: new Backbone.LocalStorage('videos'),

  initialize: function(){
//    if(!this.has('order')){
//      this.set('order', app.videos.length + 1);
//    }
  },

  group: function(){
    var matches = this.get('name').match(app.group_regex);
    return matches ? matches.splice(1) : null;
  }
});

Video.List = Backbone.Collection.extend({
  model: Video,
  localStorage: new Backbone.LocalStorage('videos'),
  comparator: 'name',
  open_files: function(files){
    var that = this
      , path;

    _.each(files, function(file){
      if(file && file.type && filetype_regex.test(file.type)){
        path = 'file:///'+file.path.replace(/\\/g, '/');
        console.log('video:', file);
        if(app.videos.pluck('path').indexOf(path) < 0){
          that.add({
            name: file.name,
            path: path,
            size: file.size,
            type: file.type
          });
        }
      }else{
        console.log('unsupported:', file);
      }
    });

    this.invoke('save');
  }
});

module.exports = Video;
