import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Docket from '../../../../src/js/claims-status/components/appeals-v2/Docket.jsx';

const defaultProps = {
  ahead: 109238,
  total: 283941
};

describe('Appeals V2 Docket', () => {
  it('should render', () => {
    const wrapper = shallow(<Docket {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should show the number of appeals ahead of the appellant', () => {
    const wrapper = shallow(<Docket {...defaultProps}/>);
    expect(wrapper.find('.appeals-ahead').text()).to.equal('109,238');
  });

  it('should show the total number of appeals on the docket', () => {
    const wrapper = shallow(<Docket {...defaultProps}/>);
    expect(wrapper.find('.front-of-docket-text + p strong').first().text()).to.equal('283,941');
  });

  it('should show a visual representaton of where the appellant is in the line', () => {
    const wrapper = shallow(<Docket {...defaultProps}/>);
    const { ahead, total } = defaultProps;
    const computedWidth = ((total - ahead) / total) * 100;
    expect(wrapper.find('.spacer').first().prop('style').width).to.equal(`${computedWidth}%`);
  });
});
