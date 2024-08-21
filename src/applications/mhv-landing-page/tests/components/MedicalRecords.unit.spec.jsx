import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import MedicalRecords, { recordTypes } from '../../components/MedicalRecords';

describe('MHV Landing Page -- temporary Medical Records page', () => {
  const pageHeading = 'the heading';

  it('renders', () => {
    const props = {
      blueButtonUrl: 'va.gov/bluebutton',
      pageHeading,
    };
    const { getByRole, getByTestId, getByText } = render(
      <MedicalRecords {...props} />,
    );
    getByTestId('mhvMedicalRecords');
    getByRole('heading', { level: 1, name: pageHeading });
    const name = 'Go back to the previous version of My HealtheVet';
    const link = getByRole('link', { name });
    expect(link.getAttribute('href')).to.eq(props.blueButtonUrl);
    recordTypes.forEach(type => getByText(type));
  });

  describe('Go back links', () => {
    it('call datadogRum.addAction on click of go-back links', async () => {
      const props = {
        blueButtonUrl: 'va.gov/bluebutton',
        pageHeading,
      };
      const { getByRole } = render(<MedicalRecords {...props} />);

      const spyDog = sinon.spy(datadogRum, 'addAction');

      await waitFor(() => {
        const goBack1 = getByRole('link', { name: /Go back/ });
        fireEvent.click(goBack1);

        expect(spyDog.called).to.be.true;

        spyDog.restore();
      });
    });
  });
});
