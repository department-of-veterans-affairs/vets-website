import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithRouter } from '../../utils';

import Automated5103Notice from '../../../components/claim-document-request-pages/Automated5103Notice';

describe('<Automated5103Notice>', () => {
  it('should render component when item is a 5103 notice', () => {
    const item = {
      closedDate: null,
      description: 'Automated 5103 Notice Response',
      displayName: 'Automated 5103 Notice Response',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2024-04-07',
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };

    const { getByText, getByTestId, content } = renderWithRouter(
      <Automated5103Notice item={item} />,
    );
    expect($('#automated-5103-notice-page', content)).to.exist;
    getByText('Review the list of evidence we need');
    expect($('.active-va-link', content)).to.have.text('Go to claim letters');
    getByText('If you have more evidence to submit');
    expect(getByTestId('upload-evidence-link').textContent).to.equal(
      'Upload your evidence here',
    );
  });
  it('should render null when item is NOT a 5103 notice', () => {
    const item = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2024-04-07',
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };

    const { content } = renderWithRouter(<Automated5103Notice item={item} />);
    expect($('#automated-5103-notice-page', content)).to.not.exist;
  });
});
