import React from 'react';

import { render } from '@testing-library/react';
import FilesOptionalOld from '../../components/FilesOptionalOld';

describe('<FilesOptionalOld>', () => {
  it('should render alert with item data', () => {
    const id = 1;
    const item = {
      displayName: 'Request 1',
      description: 'This is a alert',
    };
    const screen = render(<FilesOptionalOld id={id} item={item} />);

    screen.getByText(item.displayName);
    screen.getByText(item.description);
    screen.getByText('Optional');
    screen.getByText(
      '- We requested this from others, but upload it if you have it.',
    );
  });
});
