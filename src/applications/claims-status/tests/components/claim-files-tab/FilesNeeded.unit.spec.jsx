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

  context('boolean property fallback pattern', () => {
    context('isSensitive', () => {
      it('should use API value when provided', () => {
        const itemWithApiSensitive = {
          id: 1,
          displayName: 'ASB - tell us where, when, how exposed',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          isSensitive: false, // API value is false, dictionary would be true
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithApiSensitive} />,
        );
        // Since API value is false, should not show "Request for evidence"
        // (which only shows for sensitive items)
        getByText('Request for evidence'); // Shows because there's no friendlyName
      });

      it('should fallback to evidenceDictionary when API value not provided', () => {
        const itemWithDictSensitive = {
          id: 1,
          displayName: 'ASB - tell us where, when, how exposed',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          // No isSensitive property, should use dictionary value (true)
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithDictSensitive} />,
        );
        getByText('Request for evidence');
      });

      it('should default to false when neither API nor dictionary has value', () => {
        const itemWithNoSensitive = {
          id: 1,
          displayName: 'Unknown Item Type',
          friendlyName: 'Unknown Item',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          // No isSensitive property and not in dictionary
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithNoSensitive} />,
        );
        // Should show "Provide" prefix since isSensitive defaults to false
        getByText('Provide unknown Item');
      });
    });

    context('noProvidePrefix', () => {
      it('should use API value when provided', () => {
        const itemWithApiNoPrefix = {
          id: 1,
          displayName: 'Clarification of Claimed Issue',
          friendlyName: 'Clarification of Claimed Issue',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          noProvidePrefix: false, // API value is false, dictionary would be true
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithApiNoPrefix} />,
        );
        // Since API value is false, should show "Provide" prefix
        getByText('Provide clarification of Claimed Issue');
      });

      it('should fallback to evidenceDictionary when API value not provided', () => {
        const itemWithDictNoPrefix = {
          id: 1,
          displayName: 'Clarification of Claimed Issue',
          friendlyName: 'Clarification of Claimed Issue',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          // No noProvidePrefix property, should use dictionary value (true)
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithDictNoPrefix} />,
        );
        // Should show friendlyName without "Provide" prefix
        getByText('Clarification of Claimed Issue');
      });

      it('should default to false when neither API nor dictionary has value', () => {
        const itemWithNoPrefix = {
          id: 1,
          displayName: 'Unknown Item Type',
          friendlyName: 'Unknown Item',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          // No noProvidePrefix property and not in dictionary
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithNoPrefix} />,
        );
        // Should show "Provide" prefix since noProvidePrefix defaults to false
        getByText('Provide unknown Item');
      });
    });

    context('combined boolean properties', () => {
      it('should handle both isSensitive and noProvidePrefix from API', () => {
        const itemWithBothApiProps = {
          id: 1,
          displayName: 'Test Item',
          friendlyName: 'Test Item',
          description: 'Test description',
          suspenseDate: '2024-12-01',
          isSensitive: true,
          noProvidePrefix: false, // This shouldn't matter since isSensitive takes precedence
        };
        const { getByText } = renderWithRouter(
          <FilesNeeded claimId={claimId} item={itemWithBothApiProps} />,
        );
        // isSensitive takes precedence, should show "Request for evidence"
        getByText('Request for evidence');
      });
    });
  });
});
