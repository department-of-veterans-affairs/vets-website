import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import VeteranBenefitSummaryOptions from '../../containers/VeteranBenefitSummaryOptions';
import { UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION } from '../../utils/constants';

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
    const checkboxes = container.querySelectorAll('va-checkbox');

    expect(paragraph).to.exist;
    expect(checkboxes).to.exist;
    expect(checkboxes).to.have.lengthOf(4);

    checkboxes.forEach(checkbox => {
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

  it('dispatches the correct action when a checkbox is toggled', () => {
    const dispatchSpy = sinon.spy();
    const store = mockStore({
      letters: {
        optionsAvailable: true,
        requestOptions: {
          serviceConnectedEvaluation: true,
        },
        benefitInfo: {
          serviceConnectedPercentage: 60,
        },
        serviceInfo: [],
      },
    });

    store.dispatch = dispatchSpy;

    const { container } = render(
      <Provider store={store}>
        <VeteranBenefitSummaryOptions />
      </Provider>,
    );

    const checkbox = container.querySelector(
      'va-checkbox[label="Combined disability rating"]',
    );
    expect(checkbox).to.exist;

    // Simulate the va-checkbox change event
    // The checkbox should be checked initially (true), so clicking should make it false
    const event = new CustomEvent('vaChange', {
      bubbles: true,
    });
    // Set the target properties that the handler expects
    Object.defineProperty(event, 'target', {
      value: {
        id: 'serviceConnectedPercentage',
        checked: false,
      },
      enumerable: true,
    });
    fireEvent(checkbox, event);

    expect(dispatchSpy.called).to.be.true;

    const action = dispatchSpy.firstCall.args[0];
    expect(action.type).to.equal(UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION);
    expect(action.propertyPath).to.equal('serviceConnectedEvaluation');
    expect(action.value).to.be.false;
  });

  it('does render Military Service checkbox when service info exists', () => {
    const store = mockStore({
      letters: {
        optionsAvailable: true,
        requestOptions: {},
        benefitInfo: {
          monthlyAwardAmount: 1000,
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

    const checkbox = container.querySelector(
      'va-checkbox[label="Military service"]',
    );
    expect(checkbox).to.exist;
  });

  it('does not render Military Service checkbox when no service info exists', () => {
    const store = mockStore({
      letters: {
        optionsAvailable: true,
        requestOptions: {},
        benefitInfo: {
          monthlyAwardAmount: 1000,
        },
        serviceInfo: [],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <VeteranBenefitSummaryOptions />
      </Provider>,
    );

    const checkbox = container.querySelector(
      'va-checkbox[label="Military service"]',
    );
    expect(checkbox).to.not.exist;
  });

  it('does not render checkboxes for benefitsInfo keys with null values', () => {
    const store = mockStore({
      letters: {
        optionsAvailable: true,
        requestOptions: {
          serviceConnectedEvaluation: true,
          monthlyAward: true,
        },
        benefitInfo: {
          serviceConnectedPercentage: null, // Should be skipped
          monthlyAwardAmount: 1200,
        },
        serviceInfo: [],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <VeteranBenefitSummaryOptions />
      </Provider>,
    );

    const checkboxes = container.querySelectorAll('va-checkbox');
    expect(checkboxes.length).to.equal(1);
  });
});
