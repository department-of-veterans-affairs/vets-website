import { expect } from 'chai';

import titleReducer from '../../../src/js/gi/reducers/title.js';

describe('title reducer', () => {
  it('should set the page title', () => {
    const oldWindow = global.window;
    global.window = {
      document: {}
    };

    const state = titleReducer(
      'initialTitle',
      {
        type: 'SET_PAGE_TITLE',
        title: 'newTitle',
      }
    );

    expect(state).to.eql('newTitle');
    global.window = oldWindow;
  });
});
