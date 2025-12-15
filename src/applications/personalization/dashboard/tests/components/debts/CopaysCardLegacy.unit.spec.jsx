import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import CopaysCardLegacy from '../../../components/debts/CopaysCardLegacy';

const initialState = {
  user: {
    profile: {
      loading: false,
    },
  },
};

describe('<CopaysCardLegacy />', () => {
  it('should not display if user has no copay statements or total is 0', () => {
    const tree = renderWithStoreAndRouter(<CopaysCardLegacy />, {
      initialState,
    });

    expect(tree.getByTestId('zero-debt-paragraph')).to.exist;
    expect(
      tree.getByText('Your total VA copay balance is $0', { exact: false }),
    ).to.exist;
  });

  it('renders one CopaysCardLegacy component correctly', () => {
    const copays = [
      {
        id: 'f4385298-08a6-42f8-a86f-50e97033fb85',
        pSFacilityNum: '534',
        pSStatementDateOutput: '11/15/2021',
        pSProcessDateOutput: '11/11/2019',
        pHAmtDue: 15,
      },
    ];

    const dateUpdated = format(
      new Date(copays[0].pSStatementDateOutput),
      'MMMM dd, yyyy',
    );

    const tree = renderWithStoreAndRouter(
      <CopaysCardLegacy copays={copays} />,
      {
        initialState,
      },
    );

    expect(tree.getByTestId('copay-due-header')).to.exist;
    expect(tree.getByText(/1 copay bill/i)).to.exist;

    expect(tree.getByText(/updated on/i)).to.exist;
    expect(tree.getByText(dateUpdated, { exact: false })).to.exist;
  });

  it('renders more than one CopaysCardLegacy component correctly', () => {
    const copays = [
      {
        pSFacilityNum: '534',
        pSStatementDateOutput: '11/15/2021',
        pSProcessDateOutput: '11/11/2019',
        pHAmtDue: 15,
      },
      {
        pSFacilityNum: '668',
        pSStatementDateOutput: '04/04/2022',
        pSProcessDateOutput: '04/02/2022',
        pHAmtDue: 15,
      },
      {
        pSFacilityNum: '757',
        pSStatementDateOutput: '11/05/2021',
        pSProcessDateOutput: '06/09/2019',
        pHAmtDue: 46,
      },
    ];

    const dateUpdated = format(
      new Date(copays[1].pSStatementDateOutput),
      'MMMM dd, yyyy',
    );

    const tree = renderWithStoreAndRouter(
      <CopaysCardLegacy copays={copays} />,
      {
        initialState,
      },
    );

    expect(tree.getByTestId('copay-due-header')).to.exist;
    expect(tree.getByText(/3 copay bills/i)).to.exist;

    expect(tree.getByText(/updated on/i)).to.exist;
    expect(tree.getByText(dateUpdated, { exact: false })).to.exist;
  });
});
