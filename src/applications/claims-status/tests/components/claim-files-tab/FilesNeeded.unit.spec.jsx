import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FilesNeeded from '../../../components/claim-files-tab/FilesNeeded';
import { renderWithRouter } from '../../utils';

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
      const { getByText } = renderWithRouter(<FilesNeeded item={item} />);
      getByText('December 1, 2024', { exact: false });
      getByText(item.displayName);
      getByText(item.description);
      getByText('Details');
      expect(sessionStorage.getItem('previousPage')).to.not.exist;
    });

    context('when item type is Automated 5103 Notice Response', () => {
      const item5103 = {
        displayName: 'Automated 5103 Notice Response',
        description: 'This is a alert',
        suspenseDate: '2024-12-01',
      };
      context('when evidenceWaiverSubmitted5103 is false', () => {
        it('should render va-alert with item data and hide DueDate', () => {
          const { queryByText, getByText } = renderWithRouter(
            <FilesNeeded item={item5103} />,
          );

          expect(queryByText('December 1, 2024')).to.not.exist;
          expect(queryByText(item5103.description)).to.not.exist;
          getByText(item5103.displayName);
          getByText(
            `We sent you a "5103 notice" letter that lists the types of evidence we may need to decide your claim.`,
          );
          getByText(
            `Upload the waiver attached to the letter if you’re finished adding evidence.`,
          );
          getByText('Details');
        });
      });

      context('when evidenceWaiverSubmitted5103 is true', () => {
        it('should not render va-alert', () => {
          const { container } = renderWithRouter(
            <FilesNeeded item={item5103} evidenceWaiverSubmitted5103 />,
          );

          expect($('va-alert', container)).to.not.exist;
        });
      });
    });
  });
  context('when user navigates to page from the files tab', () => {
    it('clicking details link should set session storage', () => {
      const { getByRole } = renderWithRouter(
        <FilesNeeded item={item} previousPage={filesTab} />,
      );

      fireEvent.click(getByRole('link'));

      expect(sessionStorage.getItem('previousPage')).to.equal(filesTab);
    });
  });

  context('when user navigates to page from the status tab', () => {
    it('clicking details link should set session storage', () => {
      const { getByRole } = renderWithRouter(
        <FilesNeeded item={item} previousPage={statusTab} />,
      );

      fireEvent.click(getByRole('link'));

      expect(sessionStorage.getItem('previousPage')).to.equal(statusTab);
    });
  });
});
