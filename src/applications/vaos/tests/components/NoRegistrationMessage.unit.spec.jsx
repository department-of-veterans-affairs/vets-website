import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NoRegistrationMessage from '../../components/NoRegistrationMessage';

describe('VAOS <NoRegistrationMessage>', () => {
  it('should render', () => {
    const tree = shallow(<NoRegistrationMessage />);

    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain('can’t find any VA medical facility registrations');
    tree.unmount();
  });
});
