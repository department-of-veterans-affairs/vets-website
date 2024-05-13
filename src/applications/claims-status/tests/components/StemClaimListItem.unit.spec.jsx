import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as recordEventModule from '~/platform/monitoring/record-event';
import { renderWithRouter } from '../utils';

import StemClaimListItem from '../../components/StemClaimListItem';

describe('<StemClaimListItem>', () => {
  const defaultClaim = {
    id: 1,
    attributes: {
      automatedDenial: true,
      deniedAt: '2021-03-02',
      submittedAt: '2021-03-01',
    },
  };

  it('should render a denied STEM claim', () => {
    const { getByText } = renderWithRouter(
      <StemClaimListItem claim={defaultClaim} />,
    );
    getByText('Edith Nourse Rogers STEM Scholarship application');
    getByText('Received on March 1, 2021');
    getByText('Status: Denied');
    getByText('Last updated on: March 2, 2021');
  });

  it('when click claimCardLink, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { getByText, container } = renderWithRouter(
      <StemClaimListItem claim={defaultClaim} />,
    );
    getByText('Details');
    const claimCardLink = $('a', container);
    fireEvent.click(claimCardLink);

    expect(
      recordEventStub.calledWith({
        event: 'cta-action-link-click',
        'action-link-type': 'secondary',
        'action-link-click-label': 'Details',
        'action-link-icon-color': 'blue',
        'claim-type': 'STEM Scholarship',
        'claim-last-updated-date': 'March 2, 2021',
        'claim-submitted-date': 'March 1, 2021',
        'claim-status': 'Denied',
      }),
    ).to.be.true;
    recordEventStub.restore();
  });

  it('should not render a non-denied STEM claim', () => {
    const claim = {
      ...defaultClaim,
      attributes: {
        automatedDenial: false,
      },
    };

    const { queryByText } = renderWithRouter(
      <StemClaimListItem claim={claim} />,
    );
    expect(queryByText('Edith Nourse Rogers STEM Scholarship application')).to
      .not.exist;
    expect(queryByText('Received on March 1, 2021')).to.not.exist;
  });
});
