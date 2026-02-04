import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import CopaysCard from '../../../components/debts/CopaysCard';

const initialState = {
  user: {
    profile: {
      loading: false,
    },
  },
};

describe('<CopaysCard />', () => {
  it('renders CopaysCard without any copay bills', () => {
    const tree = renderWithStoreAndRouter(<CopaysCard />, {
      initialState,
    });

    expect(tree.getByTestId('copay-due-header')).to.exist;
    expect(tree.getByText('No copay bills', { exact: false })).to.exist;
  });

  it('renders one CopaysCard component correctly', () => {
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

    const tree = renderWithStoreAndRouter(<CopaysCard copays={copays} />, {
      initialState,
    });

    expect(tree.getByTestId('copay-due-header')).to.exist;
    expect(tree.getByText(/1 copay bill/i)).to.exist;

    expect(tree.getByText(/updated on/i)).to.exist;
    expect(tree.getByText(dateUpdated, { exact: false })).to.exist;
  });

  it('renders more than one CopaysCard component correctly', () => {
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

    const tree = renderWithStoreAndRouter(<CopaysCard copays={copays} />, {
      initialState,
    });

    expect(tree.getByTestId('copay-due-header')).to.exist;
    expect(tree.getByText(/3 copay bills/i)).to.exist;

    expect(tree.getByText(/updated on/i)).to.exist;
    expect(tree.getByText(dateUpdated, { exact: false })).to.exist;
  });
});
