import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ListBlock from '../../components/ListBlock.tsx';

describe('Avs: List Block', () => {
  it('correctly renders object lists', async () => {
    const items = [
      {
        code: 'foo',
        text: 'bar',
      },
      {
        code: 'baz',
        text: 'qux',
      },
    ];

    const props = {
      heading: 'Test Heading',
      itemType: 'test-list-type',
      items,
      keyName: 'code',
      itemName: 'text',
    };
    const screen = render(<ListBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text('Test Heading');
    expect(screen.getByTestId('test-list-type')).to.exist;
    expect(screen.getByTestId('test-list-type')).to.contain.text('qux');
    expect(screen.getByRole('list').childNodes.length).to.eq(2);
  });

  it('correctly renders string lists', async () => {
    const items = ['foo', 'bar'];

    const props = {
      heading: 'Test Heading',
      itemType: 'test-list-type',
      items,
    };
    const screen = render(<ListBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text('Test Heading');
    expect(screen.getByTestId('test-list-type')).to.exist;
    expect(screen.getByTestId('test-list-type')).to.contain.text('bar');
    expect(screen.getByRole('list').childNodes.length).to.eq(2);
  });

  it('empty lists are hidden', async () => {
    const items = [];

    const props = {
      heading: 'Test Heading',
      itemType: 'test-list-type',
      items,
    };
    const screen = render(<ListBlock {...props} />);
    expect(screen.queryByRole('heading')).to.not.exist;
  });

  it('lists with only null/empty values are hidden', async () => {
    const items = [
      {
        code: null,
        text: null,
      },
    ];

    const props = {
      heading: 'Test Heading',
      itemType: 'test-list-type',
      items,
      keyName: 'code',
      itemName: 'text',
    };
    const screen = render(<ListBlock {...props} />);
    expect(screen.queryByRole('heading')).to.not.exist;
  });

  it('string lists with only null/empty values are hidden', async () => {
    const items = ['', ''];

    const props = {
      heading: 'Test Heading',
      itemType: 'test-list-type',
      items,
      itemName: null,
      keyName: 'code',
    };
    const screen = render(<ListBlock {...props} />);
    expect(screen.queryByRole('heading')).to.not.exist;
  });

  it('defaults the heading level to h3', async () => {
    const heading = 'Test Heading';
    const items = ['foo'];
    const props = {
      heading,
      itemType: 'test-list-type',
      items,
      keyName: 'code',
    };

    const screen = render(<ListBlock {...props} />);
    expect(screen.getByRole('heading', { level: 3 })).to.have.text(heading);
  });

  it('allows setting the heading level', async () => {
    const heading = 'This is a test heading';
    const items = ['foo'];
    const headingLevel = 5;
    const props = {
      heading,
      headingLevel,
      itemType: 'test-list-type',
      items,
      keyName: 'code',
    };

    const screen = render(<ListBlock {...props} />);
    expect(screen.getByRole('heading', { level: headingLevel })).to.have.text(
      heading,
    );
  });
});
