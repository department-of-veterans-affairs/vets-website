import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

describe('<Breadcrumbs>', () => {
  it('should render first two items', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        <a href="/" key="home">Home</a>
        <a href="/disability-benefits/" key="disability-benefits">Disability Benefits</a>
        <a href="/testing/">Testing</a>
      </Breadcrumbs>
    );

    const items = tree.everySubTree('li');
    expect(items[0].subTree('a').props.href).to.equal('/');
    expect(items[1].subTree('a').props.href).to.equal('/disability-benefits/');
    expect(items[2].subTree('a').props.href).to.equal('/testing/');
    expect(items[2].text()).to.equal('Testing');
  });
});
