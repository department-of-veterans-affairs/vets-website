import React from 'react';
import { expect } from 'chai';
import { getCernerURL } from 'platform/utilities/cerner';
import { CernerWidget } from '../../components/CernerWidgets';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

describe('General Widget', () => {
  const facilityLocations = ['Facility Name'];
  let view;

  context('Cerner V1', () => {
    beforeEach(() => {
      const initialState = {
        featureToggles: {
          [Toggler.TOGGLE_NAMES.vaOnlineSchedulingStaticLandingPage]: false,
        },
      };
      view = renderWithStoreAndRouter(
        <CernerWidget facilityLocations={facilityLocations} />,
        { initialState },
      );
    });

    it('renders the correct text, including the facility names', () => {
      expect(view.getByTestId('facilities').textContent).to.contain(
        `For ${facilityLocations[0]}:`,
      );
    });

    it('renders the correct primary CTA link', () => {
      const myVAHealthLink = view.getByRole('link', {
        name: /Use My VA Health/i,
      });
      const cernerURL = getCernerURL('');
      expect(myVAHealthLink.getAttribute('href')).to.equal(cernerURL);
    });

    it('renders the correct secondary CTA link', () => {
      const ctaLink = view.getByRole('link', {
        name: /Use My HealtheVet/i,
      });
      expect(ctaLink.getAttribute('href')).to.contain(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
      );
    });
  });

  context('Cerner V2', () => {
    beforeEach(() => {
      const initialState = {
        featureToggles: {
          [Toggler.TOGGLE_NAMES.vaOnlineSchedulingStaticLandingPage]: true,
        },
      };
      view = renderWithStoreAndRouter(
        <CernerWidget facilityLocations={facilityLocations} />,
        { initialState },
      );
    });

    it('renders the correct text, including the facility names', () => {
      expect(view.getByTestId('facilities').textContent).to.contain(
        `${facilityLocations[0]}`,
      );
    });

    it('renders the correct primary CTA link', () => {
      const myVAHealthLink = view.getByRole('link', {
        name: /Go to My VA Health/i,
      });
      const cernerURL = getCernerURL('');
      expect(myVAHealthLink.getAttribute('href')).to.equal(cernerURL);
    });

    it('renders the correct secondary CTA link', () => {
      const ctaLink = view.getByRole('link', {
        name: /Go to My HealtheVet/i,
      });
      expect(ctaLink.getAttribute('href')).to.contain(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
      );
    });
  });
});
