import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import DownloadDataSection from '../../../components/nonPatientPage/DownloadDataSection';
import reducers from '../../../reducers';

const stateFn = ({
  loa = 3,
  mhvAccountState = 'OK',
  vaPatient = true,
  edipi = '1234567890',
} = {}) => ({
  user: {
    profile: {
      loa: { current: loa },
      mhvAccountState,
      vaPatient,
      edipi,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderWithStoreAndRouter(<DownloadDataSection />, {
    initialState,
    reducers,
  });

describe('DownloadDataSection component', () => {
  it('renders the correct heading', () => {
    const { getByRole } = setup();
    expect(getByRole('heading', { level: 2, name: /Download your data/ })).to
      .exist;
  });

  it('renders a download link: self-entered health information', () => {
    const { getByTestId } = setup();
    getByTestId('download-self-entered-button');
  });

  it('renders a download link: DoD military service information', () => {
    const { getByTestId } = setup();
    getByTestId('download-DoD-button');
  });

  it('does not render the DoD download link', () => {
    const initialState = stateFn({ edipi: null });
    const { queryByTestId } = setup({ initialState });
    expect(queryByTestId('download-DoD-button')).to.not.exist;
  });

  it('does not render data download section', () => {
    const initialState = stateFn({ mhvAccountState: 'NONE' });
    const { queryByRole, queryByTestId } = setup({ initialState });
    expect(queryByRole('heading', { level: 2, name: /Download your data/ })).to
      .not.exist;
    expect(queryByTestId('download-self-entered-button')).to.not.exist;
    expect(queryByTestId('download-DoD-button')).to.not.exist;
  });
});
