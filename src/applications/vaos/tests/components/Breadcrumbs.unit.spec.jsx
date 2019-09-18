import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS <Breadcrumbs>', () => {
  it('should render first two items', () => {
    const tree = shallow(
      <Breadcrumbs>
        <a href="#">Testing</a>
      </Breadcrumbs>,
    );

    const items = tree.find('a');
    expect(items.at(0).props().href).to.equal('/');
    expect(items.at(1).props().href).to.equal('/health-care');
    expect(items.at(2).props().href).to.equal('#');
    expect(items.at(2).text()).to.equal('Testing');

    tree.unmount();
  });
});
