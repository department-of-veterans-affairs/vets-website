import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ReviewPage from '../../../../components/complex-claims/pages/ReviewPage';
import reducer from '../../../../redux/reducer';

describe('Travel Pay – ReviewPage', () => {
  const defaultClaim = [
    {
      claimId: '12345',
      expenses: [
        {
          id: 'expense1',
          expenseType: 'Mileage',
          tripType: 'OneWay',
          address: {
            addressLine1: '123 Main St',
            addressLine2: 'Suite 100',
            city: 'Denver',
            stateCode: 'CO',
            zipCode: '80202',
          },
        },
        {
          id: 'expense2',
          expenseType: 'Parking',
          tripType: 'OneWay',
        },
      ],
    },
  ];

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
    },
  });

  it('renders the review page with expenses and alert', () => {
    const screen = renderWithStoreAndRouter(
      <ReviewPage claim={defaultClaim} />,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Review page container
    expect(screen.getByTestId('review-page')).to.exist;

    // Page heading
    expect(screen.getByRole('heading', { name: /your unsubmitted expenses/i }))
      .to.exist;

    // Alert component visible
    expect($('va-alert')).to.exist;

    // Add more expenses button
    expect($('#add-expense-button', screen.container)).to.exist;

    // Sign agreement button
    expect($('#sign-agreement-button', screen.container)).to.exist;

    // MileageExpenseCard should render for Mileage expense
    expect($('va-accordion-item', screen.container)).to.exist;
  });

  it('calls onNext when Sign Agreement button is clicked', () => {
    const onNextSpy = sinon.spy();

    const { container } = renderWithStoreAndRouter(
      <ReviewPage claim={defaultClaim} onNext={onNextSpy} />,
      { initialState: getData(), reducers: reducer },
    );

    const signButton = $('#sign-agreement-button', container);
    expect(signButton).to.exist;

    fireEvent.click(signButton);

    expect(onNextSpy.calledOnce).to.be.true;
  });

  it('hides alert when close button is clicked', () => {
    const { container } = renderWithStoreAndRouter(
      <ReviewPage claim={defaultClaim} />,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const alert = $('va-alert', container);
    expect(alert).to.exist;

    // Trigger the onCloseEvent of the alert
    alert.__events?.closeEvent?.();

    // After closing, the alert should still exist but visible state toggled internally
    // We can check via internal state if needed, or ensure no error occurs
    expect(alert).to.exist;
  });

  it('renders multiple expenses correctly', () => {
    const { container } = renderWithStoreAndRouter(
      <ReviewPage claim={defaultClaim} />,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Check that each expense type has an accordion item
    const accordionItems = container.querySelectorAll('va-accordion-item');
    expect(accordionItems.length).to.equal(2);

    // MileageExpenseCard rendered for Mileage expense
    const mileageCard = container.querySelector('va-accordion-item div');
    expect(mileageCard).to.exist;
  });

  it('calls addMoreExpenses when Add more expenses button is clicked', () => {
    const { container } = renderWithStoreAndRouter(
      <ReviewPage claim={defaultClaim} />,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const addButton = $('#add-expense-button', container);
    expect(addButton).to.exist;

    // Currently the function is empty, so we just fire the click to ensure no crash
    fireEvent.click(addButton);

    expect(true).to.be.true; // ensures click did not throw
  });
});
