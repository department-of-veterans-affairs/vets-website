import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import VitalDetails from '../../containers/VitalDetails';
import { vitalTypeDisplayNames } from '../../util/constants';
import vital from '../fixtures/vital.json';
import { convertVital } from '../../reducers/vitals';

describe('Vital details container', () => {
  const initialState = {
    mr: {
      vitals: {
        // vitalsList: vitals.entry.map(item => convertVital(item.resource)),
        vitalDetails: [convertVital(vital)],
      },
    },
    user,
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<VitalDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/vitals/blood-pressure',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
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

  it('displays Date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText('September', {
      exact: false,
      selector: 'h2',
    });
    expect(formattedDate.length).to.eq(2);
  });

  it('displays the result', () => {
    const screen = setup();
    const location = screen.getAllByText('126/70', {
      exact: true,
      selector: 'p',
    });
    expect(location.length).to.eq(2);
  });

  it('displays the location and provider notes', () => {
    const screen = setup();
    const location = screen.getAllByText('None noted', {
      exact: true,
      selector: 'p',
    });
    expect(location.length).to.eq(4);
  });
});
