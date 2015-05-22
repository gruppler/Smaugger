'use strict';

var config = new (Backbone.Model.extend({
  defaults: {
    group_regex: '^(\\w+).*_P(\\d+).*'
  },

  localStorage: new Backbone.LocalStorage('config'),

  initialize: function(){
    this.on('change:group_regex', this.set_group_regex);
    this.set_group_regex();
  },

  set_group_regex: function(){
    var regex;
    try{
      regex = new RegExp(this.get('group_regex'));
    }catch(e){}

    if(regex){
      app.group_regex = regex;
      $window.trigger('change_group_regex');
    }
  }

}))({id: 1});

config.fetch();

module.exports = config;
