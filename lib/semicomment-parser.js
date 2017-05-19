'use babel';

/*
 * SemiCommentParser
 *   Runs all SemiComment parser features, keeps track of settings, and
 *   watches for keystrokes.
 */
export default class SemiCommentParser {
    self = null;

    // Stores all settings, kept current by update().
    settings = null;

    // Regex for a block comment.
    regex_block = /^(\s*);(:+)(.*)$/;
    // Regex for a line comment.
    regex_line = /^\s*(;+).*$/;

  /*
   * constructor
   *   Builds the SemiCommentParser instance;
   */
  constructor () {
    self = this;

    // Set the inital configuration.
    self.update();

    // Watch for configuration updates.
    atom.config.observe('semicomment', function() {
      self.update();
    });

    // Add enter command
    atom.commands.add(
      'atom-workspace',
      'semicomment:parse-enter',
      function (event) {

        // Retreive the editor instance from Atom.
        var editor = atom.workspace.getActiveTextEditor();

        // Check for SemiComment input.
        if (!self.check(editor))
          // If the check fails, abort the key binding so enter acts normal.
          event.abortKeyBinding();
      }
    );
  }

  /*
   * check
   *   Checks for and acts on input for SemiComment.
   */
  check (editor) {
    // Get list of cursos incase there are multiple ... only act on the
    // first one for now.
    var cursors = editor.getCursors();

    // Get some variables ready.
    var text = null, matched = null, position = null;

    for (i = 0, len = cursors.length; i < len; i++) {
      // Fetch the position of the cursor.
      position = cursors[i].getBufferPosition();

      // Get the text on the line when enter was hit.
      text = editor.getTextInBufferRange([[position.row, 0], position]);

      // Check for a block comment.
      if (matched = text.match(this.regex_block)) {
        // Determine how many lines to use for the header block by pulling
        // the number of colons used at the end of the block command.
        var headers = matched[2].length;

        // Clear the value from the line, then replace the section with
        // the whitespace captured in the regex.
        editor.deleteToBeginningOfLine();
        editor.insertText(matched[1]);

        // For each colon, insert one line of header.
        for (j = 0; j < headers; j++) {
          editor.insertText(';'.repeat(this.settings.header_size));
          editor.insertNewline();
        }

        // If there was text after the command, create a common with that content.
        if (matched[3].length) {
          editor.insertText(';'.repeat(this.settings.body_size) + ' '.repeat(this.settings.header_space) + matched[3]);
          editor.insertNewline();
        }

        // Create the inital body comment space.
        editor.insertText(';'.repeat(this.settings.body_size) + ' '.repeat(this.settings.body_space));

        // Record the new cursor position.
        position = cursors[i].getBufferPosition();

        // Create the footer comment line.
        editor.insertNewline();
        editor.insertText(';'.repeat(this.settings.footer_size));

        // Return to recorded cursor position.
        editor.setCursorBufferPosition(position);

        // Created block comment, return true.
        return true;
      }

      // Check for a single comment
      if (matched = text.match(this.regex_line)) {
        // Make sure the size matches the value set in the settings
        if (matched[1].length != this.settings.body_size)
          // Size doesn't match, break out.
          break;

        // Create a new line comment on the new line.
        editor.insertNewline();
        editor.insertText(';'.repeat(this.settings.body_size) + ' '.repeat(this.settings.body_space));

        // Created line comment, return true.
        return true;
      }

      // Make sure to not continue to the next cursor if the current cursor
      // doesn't match a command.
      break;
    }

    // No action was taken -- check has failed, return false.
    return false;
  }

  /*
   * update
   *  Watches for configuration changes and makes update to system.
   */
  update () {
    this.settings = atom.config.get('semicomment');
  }
};
