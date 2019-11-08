import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NoEnrollmentMessage from '../../components/NoEnrollmentMessage';

describe('VAOS <NoEnrollmentMessage>', () => {
  it('should render', () => {
    const tree = shallow(<NoEnrollmentMessage />);

    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain('can’t find a record of your VA health care enrollment');
    tree.unmount();
  });
});
