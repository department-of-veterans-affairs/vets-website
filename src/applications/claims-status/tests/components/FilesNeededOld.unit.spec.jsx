import React from 'react';

import { renderWithRouter } from '../utils';
import FilesNeededOld from '../../components/FilesNeededOld';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
  suspenseDate: '2024-12-01',
};

describe('<FilesNeededOld>', () => {
  it('should render alert with item data', () => {
    const screen = renderWithRouter(<FilesNeededOld item={item} />);

    screen.getByText(item.displayName);
    screen.getByText(item.description);
  });
});
