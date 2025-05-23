import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import VeteranBenefitSummaryOptions from '../../containers/VeteranBenefitSummaryOptions';

const mockStore = configureStore([]);

describe('<VeteranBenefitSummaryOptions />', () => {
  it('renders loading indicator when benefit summary options are pending', () => {
    const store = mockStore({
      letters: {
        optionsAvailable: false,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <VeteranBenefitSummaryOptions />
      </Provider>,
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
    expect(container.querySelector('va-loading-indicator')).to.have.attribute(
      'message',
      'Loading your benefit summary options...',
    );
  });

  it('renders checkboxes when benefit summary options are loaded', () => {
    const store = mockStore({
      letters: {
        optionsAvailable: true,
        requestOptions: {
          militaryService: true,
          serviceConnectedEvaluation: true,
          monthlyAward: true,
          serviceConnectedDisabilities: true,
        },
        benefitInfo: {
          serviceConnectedPercentage: 60,
          awardEffectiveDate: '2021-12-01T00:00:00Z',
          monthlyAwardAmount: 1288.03,
          hasServiceConnectedDisabilities: true,
        },
        serviceInfo: [
          {
            branch: 'Army',
            characterOfService: 'HONORABLE',
            enteredDate: '1977-08-30T00:00:00Z',
            releasedDate: '1984-12-12T00:00:00Z',
          },
        ],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <VeteranBenefitSummaryOptions />
      </Provider>,
    );
    const paragraph = container.querySelector('p:first-of-type');
    const suggestedUses = container.querySelectorAll('ul.usa-list li');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');

    expect(paragraph).to.exist;
    expect(suggestedUses).to.exist;
    expect(suggestedUses).to.have.lengthOf(4);
    expect(checkboxes).to.exist;
    expect(checkboxes).to.have.lengthOf(4);

    checkboxes.forEach(checkbox => {
      expect(checkbox).to.have.property('type', 'checkbox');
      expect(checkbox).to.have.property('checked', true);
    });
  });

  it('renders the fallback if something goes wrong', () => {
    const store = mockStore({
      letters: {
        optionsAvailable: '',
      },
    });

    const { container } = render(
      <Provider store={store}>
        <VeteranBenefitSummaryOptions />
      </Provider>,
    );

    expect(container).to.exist;
  });
});
