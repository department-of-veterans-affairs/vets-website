import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import ItemsBlock from '../../components/ItemsBlock.tsx';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Items Block', () => {
  it('correctly renders all data', async () => {
    const items = replacementFunctions.cloneDeep(avsData.vitals);
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      intro: 'Test Intro',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text('Test Heading');
    expect(screen.getByText('Test Intro')).to.exist;
    expect(screen.getByTestId('test-item-type')).to.exist;
    expect(screen.getByTestId('test-item-type')).to.contain.text(
      'OximetryHeightWeightBlood',
    );
  });

  it('intro is not shown if not provided', async () => {
    const items = replacementFunctions.cloneDeep(avsData.vitals);
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    expect(screen.queryByText('Test Intro')).not.to.exist;
  });

  it('block does not render if there are no items', async () => {
    const items = [];
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    expect(screen.queryByText('Test Intro')).not.to.exist;
    expect(screen.queryByRole('heading')).to.not.exist;
    expect(screen.queryByTestId('test-item-type')).to.not.exist;
  });

  it('block renders only items that have values', async () => {
    const items = [
      {
        type: null,
      },
      {
        type: 'Valid Item',
      },
    ];
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text('Test Heading');
    expect(screen.getByTestId('test-item-type')).to.exist;
    expect(screen.getByTestId('test-item-type')).to.contain.text('Valid Item');
    expect(screen.getAllByTestId('test-item-type').length).to.eq(1);
  });

  it('block does not render if all items have empty values', async () => {
    const items = [
      {
        foo: null,
        bar: '',
      },
      {
        baz: null,
        qux: '',
      },
    ];
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    expect(screen.queryByText('Test Intro')).not.to.exist;
    expect(screen.queryByRole('heading')).to.not.exist;
    expect(screen.queryByTestId('test-item-type')).to.not.exist;
  });

  it('renders horizontal rules correctly', async () => {
    const items = replacementFunctions.cloneDeep(avsData.vitals);
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      intro: 'Test Intro',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    const vitals = screen.getByTestId('test-item-type');
    expect(within(vitals).queryAllByRole('separator').length).to.eq(
      items.length,
    );
  });

  it('does not add horizontal rules for single item sections', async () => {
    const items = [replacementFunctions.cloneDeep(avsData.vitals[0])];
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      intro: 'Test Intro',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: true,
    };
    const screen = render(<ItemsBlock {...props} />);
    const vitals = screen.getByTestId('test-item-type');
    expect(within(vitals).queryAllByRole('separator').length).to.eq(0);
  });

  it('does not render horizontal rules when told not to', async () => {
    const items = replacementFunctions.cloneDeep(avsData.vitals);
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      intro: 'Test Intro',
      itemType: 'test-item-type',
      items,
      renderItem,
      showSeparators: false,
    };
    const screen = render(<ItemsBlock {...props} />);
    const vitals = screen.getByTestId('test-item-type');
    expect(within(vitals).queryAllByRole('separator').length).to.eq(0);
  });
});
