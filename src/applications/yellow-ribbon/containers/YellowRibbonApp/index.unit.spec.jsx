// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { YellowRibbonApp } from './index';

describe('Yellow Ribbon container <YellowRibbonApp>', () => {
  it('renders what we expect with NO results', () => {
    const tree = shallow(<YellowRibbonApp />);
    const text = tree.text();

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(text).to.include('Find a Yellow Ribbon school');
    expect(text).to.include(
      'Find out if your school participates in the Yellow Ribbon program.',
    );
    expect(text).to.include(
      'Search for schools participating in the current academic year by one or all of the terms below.',
    );

    tree.unmount();
  });

  it('renders what we expect with results', () => {
    const tree = shallow(<YellowRibbonApp hasFetchedOnce />);
    const text = tree.text();

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(text).to.include('Yellow Ribbon school search results');

    // Expect there NOT to be:
    expect(text).to.not.include('Find a Yellow Ribbon school');
    expect(text).to.not.include('Learn more about the Yellow Ribbon Program.');
    expect(text).to.not.include(
      'You may be eligible for Yellow Ribbon program funding if you:',
    );

    tree.unmount();
  });
});
