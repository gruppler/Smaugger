'use strict';

module.exports = new (Backbone.Model.extend({
  defaults: {
    group_regex: '^(\w+)_.*_P(\d+)_.*'
  },

  localStorage: new Backbone.LocalStorage('config'),

  initialize: function(){}

}))({id: 1});
