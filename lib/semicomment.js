'use babel';

import SemiCommentParser from './semicomment-parser';
import { Disposable, CompositeDisposable } from 'atom';

export default  {

  subscriptions: null,
  parser: null,

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

  activate (state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.parser = new SemiCommentParser();
  },

  deactivate () {
    this.subscriptions.dispose();
  },

  serialize () {
    return { };
  }
};
