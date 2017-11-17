import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import WhatsNext from '../../../../src/js/claims-status/components/appeals-v2/WhatsNext';

describe.only('<WhatsNext/>', () => {
  it('renders', () => {
    const wrapper = shallow(<WhatsNext/>);
    expect(wrapper.type()).to.equal('div');
  });
});
