import React from 'react';

import FilesOptionalOld from '../../components/FilesOptionalOld';
import { renderWithRouter } from '../utils';

describe('<FilesOptionalOld>', () => {
  it('should render alert with item data', () => {
    const id = 1;
    const item = {
      displayName: 'Request 1',
      description: 'This is a alert',
    };
    const screen = renderWithRouter(<FilesOptionalOld id={id} item={item} />);

    screen.getByText(item.displayName);
    screen.getByText(item.description);
    screen.getByText('Optional');
    screen.getByText(
      '- We requested this from others, but upload it if you have it.',
    );
  });
});
