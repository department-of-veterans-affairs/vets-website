// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { FindYellowRibbonPage } from './index';

describe('Find Yellow Ribbon Page <FindYellowRibbonPage>', () => {
  it('renders what we expect', () => {
    const tree = shallow(<FindYellowRibbonPage />);
    const text = tree.text();

    // Expect there to be:
    expect(text).to.include('Find a Yellow Ribbon school');
    expect(text).to.include(
      'Find out if your school participates in the Yellow Ribbon program.',
    );
    expect(text).to.include(
      'Search for schools participating in the current academic year by one or all of the terms below.',
    );

    tree.unmount();
  });
});
