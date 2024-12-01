import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import formConfig from '../config/form';

describe('Edu 10282 form config', () => {
  it('should render', () => {
    expect(formConfig).to.be.an('object');
  });
  it('should have a required property', () => {
    expect(formConfig).to.have.property('rootUrl');
    expect(formConfig).to.have.property('urlPrefix');
    expect(formConfig).to.have.property('title');
    expect(formConfig).to.have.property('chapters');
    expect(formConfig).to.have.property('formId');
    expect(formConfig).to.have.property('submit');
    expect(formConfig).to.have.property('saveInProgress');
  });
  it('should have introduction component', () => {
    const wrapper = shallow(<formConfig.introduction />);
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });
  it('should have getHelp component', () => {
    const wrapper = shallow(<formConfig.getHelp />);
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });
  describe('personalInformation', () => {
    const personalInformation = formConfig.chapters.personalInformation.pages;

    it('should return state if country is United States', () => {
      const { applicantState } = personalInformation;
      expect(applicantState.depends({ country: 'United States' })).to.be.true;
    });
    it('should return applicant race and ethnicity if race and gender is true', () => {
      const raceAndEthnicity =
        formConfig.chapters.personalInformation.pages.applicantRaceAndEthnicity;
      expect(raceAndEthnicity.depends({ raceAndGender: true })).to.be.true;
    });
    it('should return applicant gender if race and gender is true', () => {
      const gender =
        formConfig.chapters.personalInformation.pages.applicantGender;
      expect(gender.depends({ raceAndGender: true })).to.be.true;
    });
  });
});
