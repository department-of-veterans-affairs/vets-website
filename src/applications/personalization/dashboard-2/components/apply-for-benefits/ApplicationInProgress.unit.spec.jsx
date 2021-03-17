import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ApplicationInProgress from './ApplicationInProgress';

describe('ApplicationInProgress component', () => {
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
      view = render(<ApplicationInProgress {...props} />);
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
      const continueButton = view.getByRole('link', { name: /continue/i });
      expect(continueButton).to.have.attr('href', props.continueUrl);
    });
  });
});
