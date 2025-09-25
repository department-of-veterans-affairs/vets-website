import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import IntroductionProcessList from '../../../components/IntroductionProcessList';

describe('IntroductionProcessList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<IntroductionProcessList />);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
  });

  it('renders the process list with three steps', () => {
    const processListItems = wrapper.find('va-process-list-item');
    expect(processListItems).to.have.length(3);
  });

  it('renders Check your eligibility step with Chapter 33 requirements', () => {
    const firstStep = wrapper.find('va-process-list-item').at(0);
    expect(firstStep.prop('header')).to.equal('Check your eligibility');

    const additionalInfos = firstStep.find('va-additional-info');
    expect(additionalInfos).to.have.length(3);

    expect(additionalInfos.at(0).prop('trigger')).to.include('(Chapter 33)');
    expect(additionalInfos.at(1).prop('trigger')).to.include('(Chapter 30)');
    expect(additionalInfos.at(2).prop('trigger')).to.include('(Chapter 1606)');
  });

  it('renders Gather your information step with all required items', () => {
    const secondStep = wrapper.find('va-process-list-item').at(1);
    expect(secondStep.prop('header')).to.equal('Gather your information');

    const listItems = secondStep.find('li');
    expect(listItems).to.have.length(3);
    expect(listItems.at(0).text()).to.include('military service history');
    expect(listItems.at(1).text()).to.include(
      'address and contact information',
    );
    expect(listItems.at(2).text()).to.include(
      'Bank account direct deposit information',
    );
  });

  it('renders Start your application step with what happens after applying info', () => {
    const thirdStep = wrapper.find('va-process-list-item').at(2);
    expect(thirdStep.prop('header')).to.equal('Start your application');

    const additionalInfo = thirdStep.find('va-additional-info');
    expect(additionalInfo).to.have.length(1);
    expect(additionalInfo.prop('trigger')).to.equal(
      'What happens after I apply?',
    );
  });
});
