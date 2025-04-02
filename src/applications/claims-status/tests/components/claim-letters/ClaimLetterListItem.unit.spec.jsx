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
  typeDescription: 'Notification letter',
};

const mockLetterWithouttypeDescription = { ...mockLetter };
delete mockLetterWithouttypeDescription.typeDescription;

describe('<ClaimLetterListItem>', () => {
  it('should render', () => {
    const { container } = render(<ClaimLetterListItem letter={mockLetter} />);

    expect(container).to.exist;
  });

  it('should have the correct title and description', () => {
    const { getByRole } = render(<ClaimLetterListItem letter={mockLetter} />);

    const title = getByRole('heading', { level: 2 });
    // Both the title and description are contained in the <h2>
    expect(title.textContent).to.eq('Notification letter September 22, 2022');
  });

  it('should use the default description when no `typeDescription` is provided', () => {
    const { getByText } = render(
      <ClaimLetterListItem letter={mockLetterWithouttypeDescription} />,
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
        'letter-type': 'Claim decision or other notification',
      }),
    ).to.be.true;
    recordEventStub.restore();
  });
});
