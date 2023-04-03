import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import VitalDetails from '../../containers/VitalDetails';

describe('Vital details container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalDetails: [
          {
            name: 'Blood pressure',
            id: '155',
            measurement: '120/80 mm[Hg]',
            date: '2022-06-14T17:42:46.000Z',
            facility: 'school parking lot',
          },
        ],
      },
    },
    user,
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<VitalDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/health-history/vitals/bloodpressure',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays CONFIDENTIAL header for print view', () => {
    const screen = setup();
    const printHeading = screen.getByRole('heading', {
      name: 'CONFIDENTIAL',
      level: 4,
    });
    expect(printHeading).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the vital name as an h1', () => {
    const screen = setup();

    const vitalName = screen.getByText(
      initialState.mr.vitals.vitalDetails[0].name,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(vitalName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText('June 14, 2022', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getAllByText(
      initialState.mr.vitals.vitalDetails[0].facility,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });
});
