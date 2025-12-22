import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';

import FilesNeeded from '../../../components/claim-files-tab/FilesNeeded';
import { renderWithRouter } from '../../utils';

const claimId = '123456';
const item = {
  id: 1,
  displayName: 'Request 1',
  description: 'This is a alert',
  suspenseDate: '2024-12-01',
};
const filesTab = 'files';
const statusTab = 'status';

describe('<FilesNeeded>', () => {
  context('when user navigates to page directly', () => {
    it('should render va-alert with item data and show DueDate', () => {
      const { getByText, container } = renderWithRouter(
        <FilesNeeded claimId={claimId} item={item} />,
      );

      getByText('December 1, 2024', { exact: false });
      getByText('Request for evidence');
      getByText(item.description);
      expect(
        container.querySelector('va-link-action[text="About this request"]'),
      ).to.exist;
      expect(sessionStorage.getItem('previousPage')).to.not.exist;
    });

    context('when item type is Automated 5103 Notice Response', () => {
      const item5103 = {
        displayName: 'Automated 5103 Notice Response',
        description: 'Test description',
        suspenseDate: '2024-12-01',
      };

      context('when evidenceWaiverSubmitted5103 is false', () => {
        it('should render va-alert with item data and hide DueDate', () => {
          const { queryByText, container } = renderWithRouter(
            <FilesNeeded claimId={claimId} item={item5103} />,
          );

          expect(queryByText('December 1, 2024')).to.not.exist;
          expect(
            queryByText(
              'We sent you a “List of evidence we may need (5103 notice)” letter. This letter lets you know if submitting additional evidence will help decide your claim.',
            ),
          ).to.exist;
          expect(queryByText('Review evidence list (5103 notice)')).to.exist;
          expect(
            container.querySelector(
              'va-link-action[text="About this request"]',
            ),
          ).to.exist;
        });
      });
    });
  });

  context('when user navigates to page from the files tab', () => {
    it('clicking details link should set session storage', () => {
      const { container } = renderWithRouter(
        <FilesNeeded claimId={claimId} item={item} previousPage={filesTab} />,
      );

      const link = container.querySelector('va-link-action');
      fireEvent.click(link);

      expect(sessionStorage.getItem('previousPage')).to.equal(filesTab);
    });
  });

  context('when user navigates to page from the status tab', () => {
    it('clicking details link should set session storage', () => {
      const { container } = renderWithRouter(
        <FilesNeeded claimId={claimId} item={item} previousPage={statusTab} />,
      );

      const link = container.querySelector('va-link-action');
      fireEvent.click(link);

      expect(sessionStorage.getItem('previousPage')).to.equal(statusTab);
    });
  });
  it('should dispaly friendly description and friendlyName of 21-4142', () => {
    const item214142 = {
      closedDate: null,
      description: '21-4142 text',
      displayName: '21-4142/21-4142a',
      friendlyName: 'Authorization to Disclose Information',
      activityDescription: 'good description',
      canUploadFile: true,
      supportAliases: ['VA Form 21-4142'],
      id: 14268,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2024-12-01',
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };
    const { getByText } = renderWithRouter(
      <FilesNeeded claimId={claimId} item={item214142} />,
    );
    getByText('good description');
    getByText('Provide authorization to Disclose Information');
  });
  it('should dispaly Request for evidence for item without override content', () => {
    const noOverrideItem = {
      closedDate: null,
      description: 'Description comes from API',
      displayName: 'track item',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2024-12-01',
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };
    const { getByText } = renderWithRouter(
      <FilesNeeded claimId={claimId} item={noOverrideItem} />,
    );
    getByText('Request for evidence');
    getByText('Description comes from API');
  });
});
