import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import ItemList from '../../components/shared/ItemList';

describe('Record list item component', () => {
  const itemList = ['foo', 'bar'];
  const emptyMessage = 'no items';

  it('renders without errors', () => {
    const screen = render(
      <ItemList list={itemList} emptyMessage={emptyMessage} />,
    );
    expect(screen);
  });

  it('should display all items in the list', () => {
    const screen = render(
      <ItemList list={itemList} emptyMessage={emptyMessage} />,
    );

    const messageElems = screen.getAllByRole('listitem');

    expect(messageElems.length).to.equal(2);
  });

  it('should display the empty message if the list is empty', () => {
    const screen = render(<ItemList list={[]} emptyMessage={emptyMessage} />);

    const emptyMessageElement = screen.getByText('no items', {
      exact: true,
      selector: 'p',
    });
    expect(emptyMessageElement).to.exist;
  });
});
