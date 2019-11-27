import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CardRow from '../../components/CardRow';
import Card from '../../components/Card';

describe('Find VA Forms <CardRow>', () => {
  it('should render', () => {
    const cardProps = {
      heading: 'heading',
      href: '/href/',
      description: 'description',
    };

    const tree = shallow(
      <CardRow>
        <Card {...cardProps} />
        <Card {...cardProps} />
        <Card {...cardProps} />
      </CardRow>,
    );

    expect(tree.find('Card')).to.have.lengthOf(3);

    tree.unmount();
  });
});
