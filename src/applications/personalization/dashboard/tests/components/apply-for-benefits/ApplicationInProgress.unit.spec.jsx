import React from 'react';
import { expect } from 'chai';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import ApplicationInProgress from '../../../components/benefit-application-drafts/ApplicationInProgress';

describe('ApplicationInProgress component', () => {
  // delete instances of this toggle and use of renderWithStoreAndRouter when #68314 is launched
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.myVaUseExperimentalFrontend]: true,
    },
  };

  const defaultProps = () => {
    return {
      continueUrl: 'application-url/resume',
      formId: '1234',
      formTitle: 'form title',
      lastOpenedDate: 'Jan 1, 2019',
      presentableFormId: 'Form 1234',
    };
  };
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  // we want to format the expirationDate like: Jan 1, 2021
  const dateFormatter = Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

  describe('when the application has not expired', () => {
    const expirationEpoch = Date.now() + oneWeekInMs;
    const expirationDate = dateFormatter.format(expirationEpoch);
    const props = { ...defaultProps(), expirationDate };
    let view;

    beforeEach(() => {
      view = renderWithStoreAndRouter(<ApplicationInProgress {...props} />, {
        initialState,
      });
    });

    it('renders the correct presentable form ID', () => {
      expect(view.getByText(props.presentableFormId)).to.exist;
    });

    it('renders the correct headline', () => {
      expect(view.getByText('Form title')).to.exist;
    });

    it('renders the expiration date', () => {
      expect(
        view.getByText(new RegExp(`expires.*${props.expirationDate}`, 'i')),
      ).to.exist;
    });

    it('renders the last opened date', () => {
      expect(view.getByText(new RegExp(`opened.*${props.lastOpenedDate}`, 'i')))
        .to.exist;
    });

    it('renders the correct "continue" button', () => {
      const continueLink = view.container.querySelector('va-link');
      expect(continueLink).to.exist;
      expect(continueLink.getAttribute('text')).to.eql(
        'Continue your application',
      );
      expect(continueLink.getAttribute('href')).to.eql(props.continueUrl);
      expect(continueLink.getAttribute('active')).to.exist;
    });
  });
});
