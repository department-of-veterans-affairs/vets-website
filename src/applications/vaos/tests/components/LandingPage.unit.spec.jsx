import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import LandingPage from '../../components/LandingPage';

describe('VAOS <LandingPage>', () => {
  it('should render links to view appts and to create a new one', () => {
    const tree = mount(<LandingPage />);

    expect(
      tree
        .find('.usa-unstyled-list')
        .find('a')
        .at(0)
        .text(),
    ).to.contain('Create a new appointment');
    expect(
      tree
        .find('.usa-unstyled-list')
        .find('a')
        .at(1)
        .text(),
    ).to.contain('View or cancel appointments');

    tree.unmount();
  });
});
