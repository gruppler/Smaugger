'use strict';

module.exports = new (Backbone.View.extend({
  el: 'body',

  initialize: function(){
    var that = this;

    this.ctrlKeys = [17, 91, 93, 224];

    $window.keydown(function(event){
      var key = event.which >= 65 && event.which <= 90 ?
          String.fromCharCode(event.which).toLocaleLowerCase() :
      event.which;

      if(key == 46){
        // Backspace -> Del
        key = 8;
      }

      if(key == 16){
        that.shiftKey = true;
        that.$el.addClass('shiftKey');
      }else if(that.ctrlKeys.indexOf(key) >= 0){
        that.ctrlKey = true;
        that.$el.addClass('ctrlKey');
      }else{
        if(that.shiftKey){
          key = '+'+key;
        }
        if(that.ctrlKey){
          key = '^'+key;
        }

        if(key in app.hotkeys.by_code){
          app.hotkeys.by_code[key][0].action(event, that, key);
        }else{
          console.log(key, event.which);
        }
      }
    });

    $window.keyup(function(event){
      var key = event.which >= 65 && event.which <= 90 ?
          String.fromCharCode(event.which) :
      event.which;

      if(key == 16){
        that.shiftKey = false;
        that.$el.removeClass('shiftKey');
      }else if(that.ctrlKeys.indexOf(key) >= 0){
        that.ctrlKey = false;
        that.$el.removeClass('ctrlKey');
      }
    });

    $window.on('context_change', this.update_current)
      .on('note:next', function(event, data){
      app.current.notes.trigger('next', event, data);
    })
      .on('note:prev', function(event, data){
      app.current.notes.trigger('prev', event, data);
    })
      .on('note:first', function(event, data){
      app.current.notes.trigger('first', event, data);
    })
      .on('note:last', function(event, data){
      app.current.notes.trigger('last', event, data);
    })
      .on('note:select', function(event, data){
      app.current.buckets.trigger('note:select', event, data);
    })
      .on('bucket:new', function(event, data){
      app.current.buckets.trigger('new', event, data);
    })
      .on('edit', function(event, view){
      that.stop_editing();
      app.current.editing = view;
    })
      .on('edit:done', function(){
      app.current.editing = null;
    })
      .on('resize', this.resize_split)
      .on('mouseup', this.end_drag);
  },

  render: function(){
    var that = this
      , hotkeys = [];

    _.each(app.hotkeys.keys, function(k){
      if(k.description){
        hotkeys.push({
          key: app.hotkeys.key_text(k.key),
          description: k.description
        });
      }
    });

    app.render('header', $('header'), { t: app.t, config: app.config.attributes });
    app.render('hotkey-help', $('#hotkey-help .content'), { hotkeys: hotkeys });

    this.$el.on('contextmenu', function(event){
      event.preventDefault();
      that.clicked_node = event.target;
      that.$clicked_node = $(event.target);
    });

    this.$el.on('dragover dragenter dragexit', app.capture_event);
    this.$el.on('drop', function(event){
      if(!_.isUndefined(event.originalEvent.dataTransfer)){
        app.capture_event(event);
        app.videos.open_files(event.originalEvent.dataTransfer.files);
      }
    });
  },

  events: {
    'click #hotkey-help': 'toggle_hotkey_help',
    'click button.open': 'browse',
    'change input[type=file]': 'open_files',
    'keyup #group-regex': 'change_grouping',
    'change #group-regex': 'change_grouping'
  },

  toggle_hotkey_help: function(){
    this.$el.toggleClass('hotkey-help');
  },

  browse: function(){
    this.$('input[type=file]').click();
  },

  open_files: function(event){
    app.videos.open_files(event.originalEvent.target.files);
    this.$('input[type=file]').val('');
  },

  change_grouping: function(event){
    var regex = $(event.currentTarget).val();

    if(regex != app.config.get('group_regex')){
      app.config.save('group_regex', regex);
    }

    app.capture_event(event);
  }
}))();
