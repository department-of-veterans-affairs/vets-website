// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { ComparisonBanner } from './index';

describe('Yellow Ribbon <ComparisonBanner>', () => {
  it('should not render when no `schoolIDs`', () => {
    const props = {
      schoolIDs: [],
    };

    const tree = shallow(<ComparisonBanner {...props} />);
    const text = tree.text();

    expect(text).to.equal('');

    tree.unmount();
  });

  it('should render when `schoolIDs`', () => {
    const props = {
      schoolIDs: ['asd', 'asdf'],
    };

    const tree = shallow(<ComparisonBanner {...props} />);
    const text = tree.text();

    expect(text).to.include('Compare 2 selected schools');

    tree.unmount();
  });
});
