import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import VAFileNumberWidget from '../../../src/js/review/VAFileNumberWidget';

describe('Schemaform review <VAFileNumberWidget>', () => {
  it('should format ssn when 9 characters', () => {
    const tree = SkinDeep.shallowRender(
      <VAFileNumberWidget value="123456789" />,
    );

    expect(tree.text()).to.equal('123-45-6789');
  });

  it('should not format when 8 characters', () => {
    const tree = SkinDeep.shallowRender(
      <VAFileNumberWidget value="12345678" />,
    );

    expect(tree.text()).to.equal('12345678');
  });

  it('should render empty value', () => {
    const tree = SkinDeep.shallowRender(<VAFileNumberWidget />);

    // The only time it will equal '' is when initializing it with value=''
    expect(tree.text()).to.equal('');
  });
});
