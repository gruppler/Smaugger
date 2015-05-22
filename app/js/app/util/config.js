'use strict';

var config = new (Backbone.Model.extend({
  defaults: {
    group_regex: '^(\\w+).*_P(\\d+)_.*'
  },

  localStorage: new Backbone.LocalStorage('config'),

  initialize: function(){}

}))({id: 1});

config.fetch();

module.exports = config;
