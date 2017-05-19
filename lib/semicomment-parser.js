'use babel';

export default class SemiCommentParser {
  snippets_service: null;
  event: null;

  constructor () {
    var self = this;
    var settings = null;

    self.update_config();

    atom.config.observe('semicomment', function() {
      self.update_config();
    });

    atom.commands.add(
      'atom-workspace',
      'semicomment:parse-enter',
      function (event) {
        self.event = event;
        var editor = atom.workspace.getActiveTextEditor();
          if (self.check(editor)) { }
          else {
            editor.insertNewline();
          }
      }
    );
  }

  check (editor) {
    var cursor_positions = editor.getCursors();

    var text = null, matched = null;
    var regex_new = /^(\s*);(:+)(.*)$/;
    var regex_continue = /^\s*(;+).*$/;

    for (i = 0, len = cursor_positions.length; i < len; i++) {
      var cursor_position = cursor_positions[i].getBufferPosition();

      text = editor.getTextInBufferRange([[cursor_position.row, 0], cursor_position]);
      if (matched = text.match(regex_new)) {
        var headers = matched[2].length;

        editor.deleteToBeginningOfLine();
        editor.insertText(matched[1]);

        for (j = 0; j < headers; j++) {
          editor.insertText(';'.repeat(this.settings.header_size));
          editor.insertNewline();
        }

        if (matched[3].length) {
          editor.insertText(';'.repeat(this.settings.body_size) + ' '.repeat(this.settings.header_space) + matched[3]);
          editor.insertNewline();
        }

        editor.insertText(';'.repeat(this.settings.body_size) + ' '.repeat(this.settings.body_space));
        cursor_position = cursor_positions[i].getBufferPosition();
        editor.insertNewline();
        editor.insertText(';'.repeat(this.settings.footer_size));
        editor.setCursorBufferPosition(cursor_position);

        return true;
      }

      if (matched = text.match(regex_continue)) {
        console.log(matched);
        if (matched[1].length != this.settings.body_size)
          break;

        editor.insertNewline();
        editor.insertText(';'.repeat(this.settings.body_size) + ' '.repeat(this.settings.body_space));
        return true;
      }

      break;
    }
    return false;
  }

  update_config () {
    var settings = atom.config.get('semicomment');
    this.settings = settings;
  }
};
