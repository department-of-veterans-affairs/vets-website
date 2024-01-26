import React from 'react';

import { render } from '@testing-library/react';
import FilesNeededOld from '../../components/FilesNeededOld';

describe('<FilesNeededOld>', () => {
  it('should render alert with item data', () => {
    const id = 1;
    const item = {
      displayName: 'Request 1',
      description: 'This is a alert',
      suspenseDate: '2024-12-01',
    };
    const screen = render(<FilesNeededOld id={id} item={item} />);
    screen.getByText(item.displayName);
    screen.getByText(item.description);
  });
});
