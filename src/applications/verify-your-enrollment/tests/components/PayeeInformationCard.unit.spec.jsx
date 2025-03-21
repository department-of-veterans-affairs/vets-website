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
  it('should handle Chapter 1606 if applicantChapter is A', () => {
    const wrapper = shallow(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantName="applicantName"
        applicantChapter="A"
      />,
    );
    expect(wrapper.find('div > div > p').text()).to.equal(
      'Montgomery GI Bill (MGIB) – Selective Reserve (Chapter 1606)',
    );
    wrapper.unmount();
  });
  it('should handle Chapter 30 if applicantChapter is B', () => {
    const wrapper = shallow(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantName="applicantName"
        applicantChapter="B"
      />,
    );
    expect(wrapper.find('div > div > p').text()).to.equal(
      'Montgomery GI Bill (MGIB) – Active Duty (Chapter 30)',
    );
    wrapper.unmount();
  });
  it('should render va-loading-indicator when is loading for applicantName', () => {
    const wrapper = shallow(
      <PayeeInformationCard
        showAdditionalInformation
        applicantName="applicantName"
        loading
      />,
    );
    expect(wrapper.find('va-loading-indicator')).to.exist;
    wrapper.unmount();
  });
  it('should render va-loading-indicator when is loading for applicantChapter', () => {
    const wrapper = shallow(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantChapter="applicantChapter"
        loading
      />,
    );
    expect(wrapper.find('va-loading-indicator')).to.exist;
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
