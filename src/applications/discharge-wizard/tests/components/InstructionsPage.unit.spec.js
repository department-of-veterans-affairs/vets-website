// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

// Relatives
import InstructionsPage from '../../components/InstructionsPage';

describe('Discharge Wizard <InstructionsPage /> ', () => {
  it('should have the html elements', () => {
    const tree = mount(<InstructionsPage />);
    const html = tree.html();
    expect(html).to.contain('Get started');
    expect(html).to.contain('How to Apply for a Discharge Upgrade');
    expect(tree.find('p[itemProp="description"]')).to.be.lengthOf(1);
    tree.unmount();
  });
});
