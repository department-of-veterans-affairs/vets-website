import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as recordEventModule from '~/platform/monitoring/record-event';

import ClaimLetterListItem from '../../../components/claim-letters/ClaimLetterListItem';

const mockLetter = {
  documentId: '{27832B64-2D88-4DEE-9F6F-DF80E4CAAA87}',
  receivedAt: '2022-09-22',
  docType: '184',
  typeDescription: 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
};

const mockLetterWithoutDocType = { ...mockLetter };
delete mockLetterWithoutDocType.docType;

describe('<ClaimLetterListItem>', () => {
  it('should render', () => {
    const { container } = render(<ClaimLetterListItem letter={mockLetter} />);

    expect(container).to.exist;
  });

  it('should have the correct title', () => {
    const { getByRole } = render(<ClaimLetterListItem letter={mockLetter} />);

    const title = getByRole('heading', { level: 2 });
    expect(title.textContent).to.eq('September 22, 2022 letter');
  });

  it('should have the correct description', () => {
    const { getByText } = render(<ClaimLetterListItem letter={mockLetter} />);

    getByText('Notification letter');
  });

  it('should use the default description when no `docType` is provided', () => {
    const { getByText } = render(
      <ClaimLetterListItem letter={mockLetterWithoutDocType} />,
    );

    getByText('Notification letter');
  });

  it(' when click Download Letter link, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');

    const { container } = render(<ClaimLetterListItem letter={mockLetter} />);
    const downloadLetterLink = $('va-link', container);
    fireEvent.click(downloadLetterLink);
    expect(
      recordEventStub.calledWith({
        event: 'claim-letters-download',
        'gtm.element.textContent': 'Download Claim Letter (PDF)',
        'gtm.elementUrl': `${environment.API_URL}/v0/claim_letters/[${
          mockLetter.docType
        }]:id.pdf`,
      }),
    ).to.be.true;
    recordEventStub.restore();
  });
});
