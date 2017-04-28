import { expect } from 'chai';

import titleReducer from '../../../src/js/gi/reducers/title.js';

describe('title reducer', () => {
  it('should set the page title', () => {
    const state = titleReducer(
      'intialTitle',
      {
        type: 'SET_PAGE_TITLE',
        title: 'newTitle',
      }
    );

    expect(state).to.be.eq('newTitle');
  });
});
