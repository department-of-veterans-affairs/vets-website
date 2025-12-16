import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import YourInformationDescription from '../../components/YourInformationDescription';

describe('YourInformationDescription component', () => {
  it('should render the correct benefit label for a known benefit type', () => {
    const formData = {
      currentBenefitType: 'chapter33',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Post-9/11 GI Bill (PGIB, Chapter 33)',
    );
    wrapper.unmount();
  });

  it('should display a default message when currentBenefitType is not provided', () => {
    const formData = {};

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      "We couldn't load your current benefit.",
    );
    wrapper.unmount();
  });

  it('should render correct label for CH30 benefit type', () => {
    const formData = {
      currentBenefitType: 'CH30',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Montgomery GI Bill (MGIB-AD, Chapter 30)',
    );
    wrapper.unmount();
  });

  it('should render correct label for CH33_TOE benefit type', () => {
    const formData = {
      currentBenefitType: 'CH33_TOE',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
    );
    wrapper.unmount();
  });

  it('should render correct label for DEA benefit type', () => {
    const formData = {
      currentBenefitType: 'DEA',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      "Dependents' Education Assistance (DEA, Chapter 35)",
    );
    wrapper.unmount();
  });
});

describe('getBenefitLabel function', () => {
  // Since getBenefitLabel is not exported, we need to test it through the component
  // or we can add export for testing purposes

  it('should return the correct label for a valid benefit type (chapter33)', () => {
    const formData = {
      currentBenefitType: 'chapter33',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Post-9/11 GI Bill (PGIB, Chapter 33)',
    );
    wrapper.unmount();
  });

  it('should return a default message when benefitType is null', () => {
    const formData = {
      currentBenefitType: null,
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      "We couldn't load your current benefit.",
    );
    wrapper.unmount();
  });

  it('should return a default message when benefitType is undefined', () => {
    const formData = {
      currentBenefitType: undefined,
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      "We couldn't load your current benefit.",
    );
    wrapper.unmount();
  });

  it('should return the input benefitType if it is not found in the labels map', () => {
    const formData = {
      currentBenefitType: 'UNKNOWN_BENEFIT_TYPE',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'UNKNOWN_BENEFIT_TYPE',
    );
    wrapper.unmount();
  });

  it('should return correct label for chapter30 benefit type', () => {
    const formData = {
      currentBenefitType: 'chapter30',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Montgomery GI Bill (MGIB-AD, Chapter 30)',
    );
    wrapper.unmount();
  });

  it('should return correct label for chapter1606 benefit type', () => {
    const formData = {
      currentBenefitType: 'chapter1606',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
    );
    wrapper.unmount();
  });

  it('should return correct label for CH33_FRY benefit type', () => {
    const formData = {
      currentBenefitType: 'CH33_FRY',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Fry Scholarship (Chapter 33)',
    );
    wrapper.unmount();
  });

  it('should return correct label for legacy transferOfEntitlement benefit type', () => {
    const formData = {
      currentBenefitType: 'transferOfEntitlement',
    };

    const wrapper = shallow(<YourInformationDescription formData={formData} />);

    expect(wrapper.find('.usa-summary-box__text p').text()).to.equal(
      'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
    );
    wrapper.unmount();
  });
});
