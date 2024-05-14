import React from 'react';

import FilesNeeded from '../../../components/claim-files-tab/FilesNeeded';
import { renderWithRouter } from '../../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
  suspenseDate: '2024-12-01',
};

describe('<FilesNeeded>', () => {
  it('should render va-alert with item data', () => {
    const screen = renderWithRouter(<FilesNeeded item={item} />);
    screen.getByText(item.displayName);
    screen.getByText(item.description);
    screen.getByText('Details');
  });
});
