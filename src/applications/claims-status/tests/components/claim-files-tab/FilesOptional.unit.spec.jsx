import React from 'react';

import FilesOptional from '../../../components/claim-files-tab/FilesOptional';
import { renderWithRouter } from '../../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
};

describe('<FilesOptional>', () => {
  it('should render alert with item data', () => {
    const { getByText } = renderWithRouter(<FilesOptional item={item} />);

    getByText(item.displayName);
    getByText(item.description);
    getByText(
      'You don’t have to do anything, but if you have this information you can',
    );
    getByText('add it here.');
  });
});
