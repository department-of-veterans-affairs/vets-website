import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import AdditionalOfficialIntro from '../../pages/AdditionalOfficialIntro';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Additional Official Intro', () => {
  it('should not render when items have been added', () => {
    const initialState = {
      form: {
        data: {
          'additional-certifying-official': [
            {
              additionalOfficialDetails: {
                fullName: {
                  first: 'John',
                  last: 'Doe',
                },
              },
              additionalOfficialTraining: {
                trainingExempt: false,
              },
              additionalOfficialBenefitStatus: {
                hasVaEducationBenefits: false,
              },
            },
          ],
        },
      },
    };
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <AdditionalOfficialIntro />
      </Provider>,
    );

    expect(container.innerHTML).to.equal('');
  });

  it('should render header and description for step when no items have been added yet', () => {
    const initialState = {
      form: {
        data: {
          'additional-certifying-official': [],
        },
      },
    };
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <AdditionalOfficialIntro />
      </Provider>,
    );

    expect(container.querySelectorAll('h3').length).to.equal(1);
    expect(container.querySelectorAll('p').length).to.equal(2);
  });
});
