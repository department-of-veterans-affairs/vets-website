import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const setup = ({ initialState = {} } = {}) =>
  renderInReduxProvider(<MhvSecondaryNav />, { initialState });

describe('<MhvSecondaryNav />', () => {
  it('renders', () => {
    const { getByRole } = setup();
    const nav = getByRole('navigation', { name: 'My HealtheVet' });
    const isHidden = nav.classList.contains('vads-u-visibility--hidden');
    expect(isHidden).to.be.false;
    const mhvLink = getByRole('link', { name: /^My HealtheVet/ });
    expect(mhvLink.href).to.match(/my-health\/$/);
    const apptLink = getByRole('link', { name: /^Appointments/ });
    expect(apptLink.href).to.match(/my-health\/appointments\/$/);
    const msgLink = getByRole('link', { name: /^Messages/ });
    expect(msgLink.href).to.match(/my-health\/secure-messages\/inbox\/$/);
    const medLink = getByRole('link', { name: /^Medications/ });
    expect(medLink.href).to.match(/my-health\/medications\/$/);
    const mrLink = getByRole('link', { name: /^Records/ });
    expect(mrLink.href).to.match(/my-health\/medical-records\/$/);
  });
});
