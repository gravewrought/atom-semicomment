'use babel';

/*
 * SemiCommentParser
 *  Registers commands with Atom and watches for configuration changes.
 */
export default class SemiCommentParser {

  /*
   * constructor
   *   Builds the SemiCommentParser instance;
   */
  constructor () {
    var self = this;
    var settings = null;

    // Set the inital configuration.
    self.update();

    // Watch for configuration updates.
    atom.config.observe('semicomment', function() {
      self.update();
    });

    atom.commands.add(
      'atom-workspace',
      'semicomment:parse-enter',
      function (event) {

        // Retreive the editor instance from Atom.
        var editor = atom.workspace.getActiveTextEditor();

        // Check line for actions for semicomment to take.
        if (!self.check(editor)) {
          // Insert a new line if the editor check didn't pass.
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

  update () {
    this.settings = atom.config.get('semicomment');
  }
};
