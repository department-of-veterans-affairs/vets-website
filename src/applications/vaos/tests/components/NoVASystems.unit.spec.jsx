import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import NoVASystems from '../../components/NoVASystems';

describe('VAOS <NoVASystems>', () => {
  it('should render alert message', () => {
    const tree = mount(<NoVASystems />);

    expect(tree.text()).to.contain(
      'You may need to call to make an appointment',
    );
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
