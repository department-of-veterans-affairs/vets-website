import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Card from '../../components/Card';

describe('Find VA Forms <Card>', () => {
  it('should render', () => {
    const props = {
      heading: 'heading',
      href: '/href/',
      description: 'description',
    };

    const tree = shallow(<Card {...props} />);
    const text = tree.text();

    expect(tree.find('a').prop('href')).to.equal(props.href);
    expect(text).to.include(props.heading);
    expect(text).to.include(props.description);

    tree.unmount();
  });
});
