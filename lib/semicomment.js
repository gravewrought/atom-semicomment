'use babel';

import SemiCommentParser from './semicomment-parser';

export default  {

  // SemiCommentParser Object.
  parser: null,

  // Base SemiComment package configuration.
  config: {
    header_size:  {
      type: 'number',
      default: 40
    },
    header_space:  {
      type: 'number',
      default: 1
    },
    body_size:  {
      type: 'number',
      default: 2
    },
    body_space:  {
      type: 'number',
      default: 2
    },
    footer_size:  {
      type: 'number',
      default: 6
    }
  },

  /*
   * activate
   *   Load the SemiComment application.
   */
  activate () {
    // Create the parser that will be used to handle commands.
    this.parser = new SemiCommentParser();
  },

};
