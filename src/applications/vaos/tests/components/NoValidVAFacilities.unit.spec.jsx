import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import NoValidVAFacilities from '../../components/NoValidVAFacilities';

describe('VAOS <NoValidVAFacilities>', () => {
  it('should render alert message', () => {
    const tree = mount(<NoValidVAFacilities />);

    expect(tree.text()).to.contain(
      'Some types of care are not available at certain VA locations',
    );
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
