import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import DownloadMilitaryServicePdf from '../../../components/nonPatientPage/DownloadMilitaryServicePdf';
import reducers from '../../../reducers';

const stateFn = ({
  loa = 3,
  edipi = '1234567890',
  mhvAccountState = 'OK',
} = {}) => ({
  user: {
    profile: {
      loa: { current: loa },
      edipi,
      mhvAccountState,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderWithStoreAndRouter(<DownloadMilitaryServicePdf />, {
    initialState,
    reducers,
  });

describe('DownloadMilitaryServicePdf component', () => {
  it('renders a download link for military service records', () => {
    const { getByTestId } = setup();
    const link = getByTestId('download-DoD-button');
    expect(link).to.exist;
    expect(link).to.have.attribute('href', '#');
    expect(link).to.have.attribute('download');
  });

  it('call datadogRum.addAction on click of download links', async () => {
    const { getByTestId } = setup();
    const spyDog = sinon.spy(datadogRum, 'addAction');

    await waitFor(() => {
      const downloadLink = getByTestId('download-DoD-button');
      // Change the link to an anchor, so JSDOM does not complain about navigation
      downloadLink.href = '#dummy-link';
      fireEvent.click(downloadLink);

      expect(spyDog.called).to.be.true;

      spyDog.restore();
    });
  });
});
