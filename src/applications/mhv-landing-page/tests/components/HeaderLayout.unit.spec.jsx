import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { render } from '../unit-spec-helpers';

import HeaderLayout from '../../components/HeaderLayout';

describe('MHV Landing Page -- Header Layout', () => {
  describe('Health Tools links', () => {
    it('renders the non-ssoe link', async () => {
      const { getByTestId } = render(<HeaderLayout showMhvGoBack />);
      await waitFor(() => {
        const goBack1 = getByTestId('mhv-go-back-1');
        expect(goBack1).to.have.attribute(
          'href',
          'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
        );
      });
    });

    it('renders the ssoe link', async () => {
      const { getByTestId } = render(<HeaderLayout ssoe showMhvGoBack />);
      await waitFor(() => {
        const goBack1 = getByTestId('mhv-go-back-1');
        expect(goBack1).to.have.attribute(
          'href',
          'https://int.eauth.va.gov/mhv-portal-web/eauth',
        );
      });
    });

    it('does not render the go back link', async () => {
      const { queryByTestId } = render(<HeaderLayout />);
      await waitFor(() => {
        expect(queryByTestId('mhv-go-back-1')).to.be.null;
      });
    });
  });

  describe('Go back links', () => {
    it('call datadogRum.addAction on click of go-back links', async () => {
      const { getByTestId } = render(<HeaderLayout showMhvGoBack />);

      const spyDog = sinon.spy(datadogRum, 'addAction');

      await waitFor(() => {
        const goBack1 = getByTestId('mhv-go-back-1');
        // Change the link to an anchor, so JSDOM does not complain about navigation
        goBack1.href = '#dummy-link';
        fireEvent.click(goBack1);

        expect(spyDog.called).to.be.true;

        spyDog.restore();
      });
    });
  });
});
