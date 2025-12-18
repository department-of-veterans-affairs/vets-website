import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';

import * as recordEventModule from '~/platform/monitoring/record-event';

import StemAskVAQuestions from '../../components/StemAskVAQuestions';
import { renderWithRouter } from '../utils';

describe('<StemAskVAQuestions>', () => {
  it('should render', () => {
    const { getByText, getByTestId } = renderWithRouter(<StemAskVAQuestions />);
    getByText('Need help?');
    getByText('Ask a question');
    getByText('Call us');
    getByText('Send us mail');
    const contactUsLink = getByTestId('contact-us-online-through-ask-va-link');
    expect(contactUsLink).to.exist;
    expect(contactUsLink.getAttribute('href')).to.equal(
      'https://www.va.gov/contact-us/',
    );
    expect(contactUsLink.getAttribute('text')).to.equal(
      'Contact us online through Ask VA',
    );
  });

  it('when click link, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');

    const { getByTestId } = renderWithRouter(<StemAskVAQuestions />);

    const contactUsLink = getByTestId('contact-us-online-through-ask-va-link');
    expect(contactUsLink).to.exist;
    fireEvent.click(contactUsLink);
    expect(
      recordEventStub.calledWith({
        event: 'nav-ask-va-questions-link-click',
        'ask-va-questions-header': 'Need help',
      }),
    ).to.be.true;
    recordEventStub.restore();
  });
});
