import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import BenefitOfInterest from '../../../components/benefit-application-drafts/BenefitOfInterest';

describe('BenefitOfInterest component', () => {
  it('renders correctly', () => {
    const onClickSpy = sinon.spy();
    const wrapper = shallow(
      <BenefitOfInterest
        title="Health care"
        icon="health-care"
        ctaButtonLabel="Learn how to apply for VA health care"
        ctaUrl="/health-care/how-to-apply/"
        onClick={onClickSpy}
      />,
    );

    expect(wrapper.find('h4').text()).to.equal('Health care');
    expect(wrapper.find('i.hub-icon-health-care')).to.exist;
    expect(wrapper.find('i.hub-background-health-care')).to.exist;

    const link = wrapper.find('CTALink');
    expect(link.prop('text')).to.include(
      'Learn how to apply for VA health care',
    );
    expect(link.prop('href')).to.equal('/health-care/how-to-apply/');
    link.simulate('click');
    expect(onClickSpy.called).to.be.true;

    wrapper.unmount();
  });
});
