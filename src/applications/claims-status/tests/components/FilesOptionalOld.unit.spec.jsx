import React from 'react';

import FilesOptionalOld from '../../components/FilesOptionalOld';
import { renderWithRouter } from '../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
};

describe('<FilesOptionalOld>', () => {
  it('should render alert with item data', () => {
    const screen = renderWithRouter(<FilesOptionalOld item={item} />);

    screen.getByText(item.displayName);
    screen.getByText(item.description);
    screen.getByText('Optional');
    screen.getByText(
      '- We requested this from others, but upload it if you have it.',
    );
  });
});
