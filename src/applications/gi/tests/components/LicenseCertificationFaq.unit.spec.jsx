import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import LicenseCertificationFaq from '../../components/LicenseCertificationFaq';

describe('<LicenseCertificationFaq />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<LicenseCertificationFaq />);
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find('va-accordion').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render all FAQ items', () => {
    const wrapper = shallow(<LicenseCertificationFaq />);
    const accordionItems = wrapper.find('va-accordion-item');
    expect(accordionItems).to.have.length(5);
    wrapper.unmount();
  });

  it('should render the correct FAQ questions', () => {
    const wrapper = shallow(<LicenseCertificationFaq />);
    const faqQuestions = [
      'What will my benefits cover?',
      'How do I get reimbursed for the licenses, certifications, and prep courses?',
      'Can I get paid to take a test more than once?',
      'What is the difference between a license and certification?',
      'What is a prep course?',
    ];

    faqQuestions.forEach((question, index) => {
      expect(
        wrapper
          .find('va-accordion-item')
          .at(index)
          .prop('header'),
      ).to.equal(question);
    });

    wrapper.unmount();
  });

  it('should trigger handleFaqClick on FAQ item click', () => {
    const wrapper = mount(<LicenseCertificationFaq />);
    const scrollIntoViewStub = sinon.stub();
    global.document.getElementById = sinon
      .stub()
      .returns({ scrollIntoView: scrollIntoViewStub });

    const accordionItem = wrapper.find('va-accordion-item').at(0);
    accordionItem.simulate('click');

    expect(scrollIntoViewStub.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle keyboard interaction on FAQ item', () => {
    const wrapper = mount(<LicenseCertificationFaq />);
    const scrollIntoViewStub = sinon.stub();
    global.document.getElementById = sinon
      .stub()
      .returns({ scrollIntoView: scrollIntoViewStub });

    const accordionItem = wrapper.find('va-accordion-item').at(0);

    accordionItem.simulate('keydown', { key: 'Enter' });
    expect(scrollIntoViewStub.calledOnce).to.be.true;

    accordionItem.simulate('keydown', { key: ' ' });
    expect(scrollIntoViewStub.calledTwice).to.be.true;

    wrapper.unmount();
  });

  it('should not trigger scroll if incorrect key is pressed', () => {
    const wrapper = mount(<LicenseCertificationFaq />);
    const scrollIntoViewStub = sinon.stub();
    global.document.getElementById = sinon
      .stub()
      .returns({ scrollIntoView: scrollIntoViewStub });

    const accordionItem = wrapper.find('va-accordion-item').at(0);
    accordionItem.simulate('keydown', { key: 'ArrowDown' });

    expect(scrollIntoViewStub.called).to.be.false;
    wrapper.unmount();
  });
});
