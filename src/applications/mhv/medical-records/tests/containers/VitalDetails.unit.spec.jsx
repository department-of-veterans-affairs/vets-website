import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import VitalDetails from '../../containers/VitalDetails';
import { vitalTypeDisplayNames, vitalTypes } from '../../util/constants';

describe('Vital details container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalDetails: [
          {
            type: vitalTypes.BLOOD_PRESSURE,
            id: '155',
            measurement: '120/80 mm[Hg]',
            date: '2022-06-14T17:42:46.000Z',
            location: 'school parking lot',
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
      path: '/health-history/vitals/blood-pressure',
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

  it('displays the vital name inside an h1 as a span', () => {
    const screen = setup();

    const vitalName = screen.getByText(
      vitalTypeDisplayNames[initialState.mr.vitals.vitalDetails[0].type],
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(vitalName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText('June', {
      exact: false,
      selector: 'h2',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getAllByText(
      initialState.mr.vitals.vitalDetails[0].location,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });
});
