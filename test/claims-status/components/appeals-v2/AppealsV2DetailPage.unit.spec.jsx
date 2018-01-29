import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AppealsV2DetailPage from '../../../../src/js/claims-status/containers/AppealsV2DetailPage';

describe('<AppealsV2DetailPage/>', () => {
  it('renders', () => {
    const wrapper = shallow(<AppealsV2DetailPage/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('renders the <Issues/> component', () => {
    const wrapper = shallow(<AppealsV2DetailPage/>);
    expect(wrapper.find('Issues').length).to.equal(1);
  });
});
