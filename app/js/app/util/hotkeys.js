'use strict';

var t = app.require('/nls/keys.js');

var hotkeys = {
  keys: [{
    key: '+191',
    description: t.Toggle_hotkey_help,
    action: function(event){
      app.capture_event(event);
      app.view.toggle_hotkey_help(event);
    }
  }],

  key_text: function(key){
    var text = '<span>';

    key = ''+key;

    if(key in t){
      text += t[key];
    }else{
      if(key.indexOf('^') >= 0){
        text += t[17]+'</span> + <span>';
      }
      if(key.indexOf('+') >= 0){
        text += t[16]+'</span> + <span>';
      }
      key = key.replace(/[+^]/g, '');

      if(key in t){
        text += t[key];
      }else{
        text += key;
      }
    }
    text += '</span>';

    return text;
  }
};

hotkeys.by_code = _.groupBy(hotkeys.keys, 'key');

module.exports = hotkeys;
