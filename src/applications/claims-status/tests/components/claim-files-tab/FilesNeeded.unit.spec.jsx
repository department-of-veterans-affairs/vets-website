import React from 'react';
import { expect } from 'chai';

import FilesNeeded from '../../../components/claim-files-tab/FilesNeeded';
import { renderWithRouter } from '../../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
  suspenseDate: '2024-12-01',
};

describe('<FilesNeeded>', () => {
  it('should render va-alert with item data and show DueDate', () => {
    const { getByText } = renderWithRouter(<FilesNeeded item={item} />);
    getByText('December 1, 2024', { exact: false });
    getByText(item.displayName);
    getByText(item.description);
    getByText('Details');
  });

  context('when item type is Automated 5103 Notice Response', () => {
    const item5103 = {
      displayName: 'Automated 5103 Notice Response',
      description: 'This is a alert',
      suspenseDate: '2024-12-01',
    };
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
        `Upload the waiver attached to letter if you’re finished adding evidence.`,
      );
      getByText('Details');
    });
  });
});
