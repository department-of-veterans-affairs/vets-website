import React from 'react';
import sinon from 'sinon';
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
      removeForm: () => {},
      startNewApplicationUrl: 'application-url',
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
  describe('when the application has expired', () => {
    const removeFormSpy = sinon.spy();
    const expirationEpoch = Date.now() - oneWeekInMs;
    const expirationDate = dateFormatter.format(expirationEpoch);
    const props = {
      ...defaultProps(),
      expirationDate,
      removeForm: removeFormSpy,
    };
    let view;
    beforeEach(() => {
      view = render(<ApplicationInProgress {...props} />);
    });
    it('renders the "expired" message', () => {
      expect(view.getByText(/Expired: Your form title has expired/i)).to.exist;
    });
    it('renders the "start a new application" button with accessible label', () => {
      const continueButton = view.getByRole('link', {
        name: new RegExp(`start a new ${props.formTitle}`, 'i'),
      });
      expect(continueButton).to.have.attr('href', props.startNewApplicationUrl);
    });
    it('renders a "remove" button that calls the `removeForm` prop when clicked', () => {
      const removeButton = view.getByRole('button', {
        name: new RegExp(`remove.*${props.formTitle}`, 'i'),
      });
      removeButton.click();
      expect(removeFormSpy.calledOnce).to.be.true;
    });
  });
});
