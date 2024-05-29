import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as recordEventModule from '~/platform/monitoring/record-event';

import StemAskVAQuestions from '../../components/StemAskVAQuestions';
import { renderWithRouter } from '../utils';

describe('<StemAskVAQuestions>', () => {
  it('should render', () => {
    const { getByText } = renderWithRouter(<StemAskVAQuestions />);
    getByText('Need help?');
    getByText('Ask a question');
    getByText('Call us');
    getByText('Send us mail');
    getByText('Contact us online through Ask VA');
  });

  it('when click link, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');

    const { container, getByText } = renderWithRouter(<StemAskVAQuestions />);

    getByText('Contact us online through Ask VA');
    const contactUsLink = $('a', container);
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
