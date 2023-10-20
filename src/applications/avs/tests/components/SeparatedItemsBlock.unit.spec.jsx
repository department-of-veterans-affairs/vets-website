import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import SeparatedItemsBlock from '../../components/SeparatedItemsBlock';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Separated Items Block', () => {
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
    };
    const screen = render(<SeparatedItemsBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text('Test Heading');
    expect(screen.getByText('Test Intro')).to.exist;
    expect(screen.getByTestId('test-item-type')).to.exist;
    expect(screen.getByTestId('test-item-type')).to.contain.text(
      'OximetryHeightWeightBlood',
    );
  });

  it('sections without data are hidden', async () => {
    const items = replacementFunctions.cloneDeep(avsData.vitals);
    const renderItem = item => {
      return <p>{item.type}</p>;
    };

    const props = {
      heading: 'Test Heading',
      itemType: 'test-item-type',
      items,
      renderItem,
    };
    const screen = render(<SeparatedItemsBlock {...props} />);
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
    };
    const screen = render(<SeparatedItemsBlock {...props} />);
    expect(screen.queryByText('Test Intro')).not.to.exist;
    expect(screen.queryByRole('heading')).to.not.exist;
    expect(screen.queryByTestId('test-item-type')).to.not.exist;
  });
});
