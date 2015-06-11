'use strict';

global.localStorage = window.localStorage;

var path = require('path')
  , vash = require('vash');

global.$ = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.LocalStorage = require('backbone.localstorage');
global.$window = global.$(window);
global.document = window.document;

global.$.fn.appendAt = function(content, i){
  if(i < 1){
    this.prepend(content);
  }else if(i >= this.children().length){
    this.append(content);
  }else{
    $(content).insertBefore(this.children().eq(i));
  }

  return this;
};

global.app = {
  gui: require('nw.gui'),
  fs: require('fs'),

  require: function(file){
    return require(path.join(process.cwd(),'./js/app/'+file));
  },

  render: function(template, $el, model, callback){
    global.app.fs.readFile(
      'js/app/templates/'+template+'.vash',
      { encoding: 'utf8' },
      function(err, data){
        if(err){ throw err; }
        $el.html(vash.compile(data)(model));
        if(global._.isFunction(callback)){
          callback();
        }
      }
    );
  },

  capture_event: function(event, allow_default_action){
    if(event && typeof event.preventDefault != 'undefined'){
      if(!allow_default_action){
        event.preventDefault();
      }
      if(typeof event.stopPropagation != 'undefined'){
        event.stopPropagation();
      }else{
        event.cancelBubble = true;
      }
    }
  }
};

global.$(function(){
  var app = global.app;

  app.t = app.require('nls/main.js');

  app.view = app.require('views/app.js');
  app.hotkeys = app.require('util/hotkeys.js');
  app.config = app.require('util/config.js');

  app.Video = app.require('models/video.js');
  app.VideoView = app.require('views/video.js');

  app.videos = new app.Video.List();
  app.view.videos = new app.VideoView.List({
    model: app.videos
  });

  app.videos.fetch();

  app.view.setElement(global.$('body'));
  app.view.render();
});
