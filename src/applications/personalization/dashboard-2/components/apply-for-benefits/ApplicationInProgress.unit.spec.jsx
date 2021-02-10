import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ApplicationInProgress from './ApplicationInProgress';

describe('ApplicationInProgress component', () => {
  const props = {
    continueUrl: 'application-url/',
    expirationDate: 'Jan 1, 2020',
    formId: '1234',
    formTitle: 'Form Title',
    lastOpenedDate: 'Jan 1, 2019',
    presentableFormId: 'Form 1234',
  };
  let view;
  beforeEach(() => {
    view = render(<ApplicationInProgress {...props} />);
  });
  it('renders the correct presentable form ID', () => {
    expect(view.getByText(props.presentableFormId)).to.exist;
  });
  it('renders the correct headline', () => {
    expect(view.getByText(props.formTitle)).to.exist;
  });
  it('renders the expiration date', () => {
    expect(view.getByText(new RegExp(`expires.*${props.expirationDate}`, 'i')))
      .to.exist;
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
