import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PayeeInformationCard from '../../components/PayeeInformationCard';

describe('PayeeInformationCard', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<PayeeInformationCard />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('should render applicantName and showAdditionalInformation', () => {
    const wrapper = shallow(
      <PayeeInformationCard
        showAdditionalInformation
        applicantName="applicantName"
      />,
    );
    expect(wrapper.find('va-additional-info')).to.exist;
    wrapper.unmount();
  });
  it('should render applicantChapter when showAdditionalInformation is false', () => {
    const wrapper = shallow(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantName="applicantName"
        applicantChapter="applicantChapter"
      />,
    );
    expect(wrapper.find('div > div > p').text()).to.equal('applicantChapter');
    wrapper.unmount();
  });
  it('should render applicantClaimNumber when applicantClaimNumber is not null', () => {
    const wrapper = shallow(
      <PayeeInformationCard applicantClaimNumber="applicantClaimNumber" />,
    );
    expect(
      wrapper
        .find('p')
        .last()
        .text(),
    ).to.equal('applicantClaimNumber');
    wrapper.unmount();
  });
});
