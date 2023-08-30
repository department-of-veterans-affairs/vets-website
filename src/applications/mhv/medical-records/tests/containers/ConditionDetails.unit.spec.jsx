import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import ConditionDetails from '../../containers/ConditionDetails';
import { dateFormat } from '../../util/helpers';

describe('Condition details container', () => {
  const initialState = {
    mr: {
      conditions: {
        conditionDetails: {
          id: 'SCT161891005',
          name: 'Back pain (SCT 161891005)',
          active: true,
          provider: 'Becky',
          facility: "chiropractor's office",
          comments: [],
        },
      },
    },
    user,
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<ConditionDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/health-conditions/SCT161891005',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays Date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the condition name', () => {
    const screen = setup();

    const conditionName = screen.getByText(
      initialState.mr.conditions.conditionDetails.name.split(' (')[0],
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(conditionName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText(
      dateFormat(
        initialState.mr.conditions.conditionDetails?.date,
        'MMMM D, YYYY [at] h:mm z',
      ),
      {
        exact: true,
        selector: 'span',
      },
    );
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getAllByText(
      initialState.mr.conditions.conditionDetails.facility,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });
});
