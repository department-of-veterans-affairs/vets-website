import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import DocketCard from '../../../components/appeals-v2/DocketCard';

describe('Appeals V2 DocketCard', () => {
  const defaultProps = {
    ahead: 109238,
    total: 283941,
  };
  const amaProps = {
    ahead: 109238,
    total: 283941,
    docket: 'directReview',
  };

  it('should render', () => {
    const wrapper = shallow(<DocketCard {...defaultProps} />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should show the number of appeals ahead of the appellant', () => {
    const wrapper = shallow(<DocketCard {...defaultProps} />);
    expect(wrapper.find('.appeals-ahead').text()).to.equal('109,238');
    wrapper.unmount();
  });

  it('should show the total number of appeals on the docket', () => {
    const wrapper = shallow(<DocketCard {...defaultProps} />);
    expect(
      wrapper
        .find('.front-of-docket-text + p strong')
        .first()
        .text(),
    ).to.equal('283,941');
    wrapper.unmount();
  });

  it('should show a visual representaton of where the appellant is in the line', () => {
    const wrapper = shallow(<DocketCard {...defaultProps} />);
    const { ahead, total } = defaultProps;
    const computedWidth = ((total - ahead) / total) * 100;
    expect(
      wrapper
        .find('.spacer')
        .first()
        .prop('style').width,
    ).to.equal(`${computedWidth}%`);
    wrapper.unmount();
  });

  it('should correctly label the AMA docket', () => {
    const wrapper = shallow(<DocketCard {...amaProps} />);
    expect(wrapper.text()).to.contain('the Direct Review docket');
    wrapper.unmount();
  });

  it('should leave a legacy docket alone', () => {
    const wrapper = shallow(<DocketCard {...defaultProps} />);
    expect(wrapper.text()).to.contain('the  docket');
    wrapper.unmount();
  });
});
