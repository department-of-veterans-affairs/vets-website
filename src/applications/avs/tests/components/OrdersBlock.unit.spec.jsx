import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import OrdersBlock from '../../components/OrdersBlock';

import { ORDER_TYPES } from '../../utils/constants';
import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;
const type = ORDER_TYPES.LAB;

describe('Avs: Orders Block', () => {
  it('correctly renders all data', async () => {
    const orders = replacementFunctions.cloneDeep(avsData.orders);
    const props = {
      heading: 'Test Heading',
      intro: 'Test Intro',
      orders,
      type,
    };
    const screen = render(<OrdersBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text('Test Heading');
    expect(screen.getByText('Test Intro')).to.exist;
    expect(screen.getByRole('list'))
      .to.have.attribute('data-testid')
      .match(/lab-tests/);
    expect(screen.getAllByRole('listitem')[0]).to.have.text(
      'OCCULT BLOOD FIT X1 SCREEN STOOL FECES (January 01, 2023)',
    );
  });

  it('sections without data are hidden', async () => {
    const orders = replacementFunctions.cloneDeep(avsData.orders);
    const props = {
      heading: 'Test Heading',
      orders,
      type,
    };
    const screen = render(<OrdersBlock {...props} />);
    expect(screen.queryByText('Test Intro')).to.not.exist;
  });

  it('sections without data are hidden', async () => {
    const orders = replacementFunctions.cloneDeep(avsData.orders);
    const invalidType = {
      key: 'FOO',
      label: 'Foo',
    };
    const props = {
      heading: 'Test Heading',
      intro: 'Test Intro',
      orders,
      type: invalidType,
    };
    const screen = render(<OrdersBlock {...props} />);
    expect(screen.queryByRole('heading')).to.not.exist;
    expect(screen.queryByRole('list')).to.not.exist;
  });
});
