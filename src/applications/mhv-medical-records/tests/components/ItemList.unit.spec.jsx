import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import ItemList from '../../components/shared/ItemList';

describe('Record list item component', () => {
  const itemList = ['foo', 'bar'];

  it('renders without errors', () => {
    const screen = render(<ItemList list={itemList} />);
    expect(screen).to.exist;
  });

  it('should display all items in the list', () => {
    const screen = render(<ItemList list={itemList} />);

    const messageElems = screen.getAllByRole('listitem');

    expect(messageElems.length).to.equal(2);
  });

  it('should display the empty message if the list is empty', () => {
    const screen = render(<ItemList list={[]} />);

    const emptyMessageElement = screen.getByText('None recorded', {
      exact: true,
      selector: 'p',
    });
    expect(emptyMessageElement).to.exist;
  });

  it('should display the string passed as list arg if a string is passed instead of an array', () => {
    const screen = render(<ItemList list="test" />);
    expect(screen.getByText('test')).to.exist;
  });
});
