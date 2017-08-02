import { expect } from 'chai';

import titleReducer from '../../../src/js/gi/reducers/title.js';

describe('title reducer', () => {
  it('should set the page title', () => {
    window.document = {};

    const state = titleReducer(
      'initialTitle',
      {
        type: 'SET_PAGE_TITLE',
        title: 'newTitle',
      }
    );

    expect(state).to.eql('newTitle');
  });
});
