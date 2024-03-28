import React from 'react';

import TabItem from '../../components/TabItem';
import { renderWithRouter } from '../utils';

describe('<TabItem>', () => {
  it('should render tab', () => {
    const screen = renderWithRouter(
      <TabItem shortcut={1} title="Title" tabpath="appeals/1234567/status" />,
    );

    screen.getByText('Title');
  });

  it('should use id if present', () => {
    const screen = renderWithRouter(
      <TabItem
        shortcut={1}
        id="TitleHere"
        title="Title Here"
        tabpath="appeals/1234567/status"
      />,
    );

    screen.getByText('Title Here');
  });
});
