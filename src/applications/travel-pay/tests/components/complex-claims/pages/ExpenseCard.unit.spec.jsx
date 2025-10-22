import React from 'react';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ExpenseCard from '../../../../components/complex-claims/pages/ExpenseCard';
import reducer from '../../../../redux/reducer';

describe('ExpenseCard', () => {
  const defaultExpense = {
    address: {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressLine3: '',
      city: 'Washington',
      stateCode: 'DC',
      zipCode: '20001',
    },
    tripType: 'OneWay',
  };

  const getData = () => ({});

  it('renders the component correctly', () => {
    renderWithStoreAndRouter(<ExpenseCard expense={defaultExpense} />, {
      initialState: getData(),
      reducers: reducer,
    });

    // Check the header
    const header = $('.review-header');
    expect(header).to.exist;
    expect(header.textContent).to.include('About your route');

    // Check the address
    const addressDt = $('dt');
    expect(addressDt.textContent).to.include(
      'Which address did you depart from?',
    );

    const addressDd = $('dd span');
    expect(addressDd.textContent).to.include('123 Main St');
    expect(addressDd.textContent).to.include('Apt 4B');
    expect(addressDd.textContent).to.include('Washington, DC 20001');

    // Check the trip type
    const tripDd = $$('dt')[1].nextElementSibling; // second dd
    expect(tripDd.textContent).to.include('One Way');

    // Check the edit button exists
    const editButton = $('#edit-expense-button');
    expect(editButton).to.exist;
    expect(editButton.text).to.include('Edit');
  });

  it('renders correctly when addressLine2 and addressLine3 are empty', () => {
    const expense = {
      address: {
        addressLine1: '456 Elm St',
        addressLine2: '',
        addressLine3: '',
        city: 'Seattle',
        stateCode: 'WA',
        zipCode: '98101',
      },
      tripType: 'RoundTrip',
    };

    renderWithStoreAndRouter(<ExpenseCard expense={expense} />, {
      initialState: getData(),
      reducers: reducer,
    });

    const addressDd = $('dd span');
    expect(addressDd.textContent).to.include('456 Elm St');
    expect(addressDd.textContent).to.include('Seattle, WA 98101');
    expect(addressDd.textContent).to.not.include('undefined');
    expect(addressDd.textContent).to.not.include('\n\n'); // no extra empty lines

    const tripDd = $$('dt')[1].nextElementSibling;
    expect(tripDd.textContent).to.include('Round Trip');
  });

  it('calls editExpense when Edit button is clicked', () => {
    const consoleSpy = sinon.spy(console, 'log');

    const { container } = renderWithStoreAndRouter(
      <ExpenseCard expense={defaultExpense} />,
      {
        initialState: {},
        reducers: reducer,
      },
    );

    const editButton = $('#edit-expense-button', container);
    expect(editButton).to.exist;

    fireEvent.click(editButton);

    expect(consoleSpy.calledWith('Edit clicked')).to.be.true;

    consoleSpy.restore();
  });
});
