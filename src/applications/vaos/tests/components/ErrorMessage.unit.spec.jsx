import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ErrorMessage from '../../components/ErrorMessage';

describe('VAOS <ErrorMessage>', () => {
  it('should render', () => {
    const tree = shallow(<ErrorMessage />);

    expect(tree.find('AlertBox').props().status).to.equal('error');

    tree.unmount();
  });
});
