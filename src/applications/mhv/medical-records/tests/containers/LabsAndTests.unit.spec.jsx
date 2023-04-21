import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import LabsAndTests from '../../containers/LabsAndTests';
import reducer from '../../reducers';

describe('LabsAndTests list container', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: null,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LabsAndTests />, {
      initialState: state,
      reducers: reducer,
      path: '/labs-and-tests',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Lab and test results', { exact: true })).to.exist;
  });

  it('displays additional info', () => {
    const screen = setup();
    expect(
      screen.getByText(
        'Review lab and test results in your VA medical records.',
        {
          exact: true,
        },
      ),
    ).to.exist;
  });
});
