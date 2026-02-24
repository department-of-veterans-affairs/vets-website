import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import SuccessNotification from '../../../components/RefillPrescriptions/SuccessNotification';
import { MEDICATION_REFILL_CONFIG } from '../../../util/constants';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';
import { dataDogActionNames } from '../../../util/dataDogConstants';

describe('SuccessNotification component', () => {
  const defaultConfig = MEDICATION_REFILL_CONFIG.SUCCESS;
  const defaultSuccessfulMeds = refillableList.slice(0, 3);

  const mockStore = {
    getState: () => ({
      featureToggles: {},
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const setup = (handleClick = sinon.spy()) => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SuccessNotification
            config={defaultConfig}
            handleClick={handleClick}
            successfulMeds={defaultSuccessfulMeds}
          />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('renders without errors', () => {
    const { getByTestId } = setup();
    expect(getByTestId('success-refill')).to.exist;
  });

  it('sets data-dd-privacy mask on the alert', () => {
    const { getByTestId } = setup();
    expect(
      getByTestId('success-refill').getAttribute('data-dd-privacy'),
    ).to.equal('mask');
  });

  it('renders the alert title', () => {
    const { getByTestId } = setup();
    expect(getByTestId('success-refill-title').textContent).to.equal(
      defaultConfig.title,
    );
  });

  it('renders the medication list', () => {
    const { getByTestId } = setup();
    expect(getByTestId('successful-medication-list')).to.exist;
  });

  it('displays the list of requested medications', () => {
    const { getAllByTestId } = setup();
    const items = getAllByTestId(/^successful-medication-list-\d+$/);
    expect(items).to.have.lengthOf(defaultSuccessfulMeds.length);
  });

  it('renders success description with correct content', () => {
    const { getByTestId } = setup();
    const descriptionContainer = getByTestId('success-refill-description');
    expect(descriptionContainer.textContent).to.include(
      defaultConfig.description,
    );
  });

  it('renders link with correct attributes', () => {
    const { getByTestId } = setup();
    const link = getByTestId('back-to-medications-page-link');
    expect(link).to.exist;
    expect(link.textContent).to.equal(defaultConfig.linkText);
    expect(link.getAttribute('data-dd-action-name')).to.equal(
      dataDogActionNames.refillPage.GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK,
    );
    expect(link.getAttribute('href')).to.equal('/');
    expect(link.classList.contains('hide-visited-link')).to.be.true;
  });

  it('calls handleClick when link is clicked', () => {
    const handleClick = sinon.spy();
    const { getByTestId } = setup(handleClick);
    fireEvent.click(getByTestId('back-to-medications-page-link'));
    expect(handleClick.calledOnce).to.be.true;
  });
});
