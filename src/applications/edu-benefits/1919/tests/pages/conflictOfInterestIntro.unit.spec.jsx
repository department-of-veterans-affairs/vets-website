import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ConflictOfInterestIntro from '../../pages/conflictOfInterestIntro';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Conflict of Interest Intro', () => {
  it('should not render when items have been added', () => {
    const initialState = {
      form: {
        data: {
          'conflict-of-interest': [
            {
              certifyingOfficial: { title: 'Official' },
              fileNumber: '123456AB',
              enrollmentPeriod: {
                from: '2024-03-10',
                to: '2025-04-27',
              },
            },
          ],
        },
      },
    };
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <ConflictOfInterestIntro />
      </Provider>,
    );

    expect(container.innerHTML).to.equal('');
  });

  it('should render header and description for step when no items have been added yet', () => {
    const initialState = {
      form: {
        data: {
          'conflict-of-interest': [],
        },
      },
    };
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <ConflictOfInterestIntro />
      </Provider>,
    );

    expect(container.querySelectorAll('h3').length).to.equal(1);
    expect(container.querySelectorAll('p').length).to.equal(4);
  });
});
