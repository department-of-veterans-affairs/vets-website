import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NoEnrollmentMessage from '../../components/NoEnrollmentMessage';

describe('VAOS <NoRegistrationMessage>', () => {
  it('should render', () => {
    const tree = shallow(<NoEnrollmentMessage />);

    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain('couldn’t find a record of your enrollment');
    tree.unmount();
  });
});
