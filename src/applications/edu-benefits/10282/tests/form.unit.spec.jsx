import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import formConfig from '../config/form';
import CustomPageReview from '../components/CustomPageReview';

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

    it('should render CustomPageReview for race and gender question', () => {
      const props = {
        data: {
          raceAndGender: 'Yes',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <personalInformation.genderRaceQuestion.CustomPageReview {...props} />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should render CustomPageReview for veteran desc question', () => {
      const props = {
        data: {
          veteranDesc: `I'm a Veteran`,
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <personalInformation.veteranDesc.CustomPageReview {...props} />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should render CustomPageReview for applicant country question', () => {
      const props = {
        data: {
          country: 'United States',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <personalInformation.applicantCountry.CustomPageReview {...props} />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should return state if country is United States', () => {
      const { applicantState } = formConfig.chapters.personalInformation.pages;
      expect(applicantState.depends({ country: 'United States' })).to.be.true;
    });
    it('should return applicant race and ethnicity if race and gender is true', () => {
      const raceAndEthnicity =
        formConfig.chapters.personalInformation.pages.applicantRaceAndEthnicity;
      expect(raceAndEthnicity.depends({ raceAndGender: 'Yes' })).to.be.true;
    });
    it('should render CustomPageReview for applicant gender question', () => {
      const props = {
        data: {
          gender: 'Prefer not to answer',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <personalInformation.applicantGender.CustomPageReview {...props} />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should return applicant gender if race and gender is true', () => {
      const gender =
        formConfig.chapters.personalInformation.pages.applicantGender;
      expect(gender.depends({ raceAndGender: 'Yes' })).to.be.true;
    });
  });
  describe('educationAndEmploymentHistory', () => {
    const educationAndEmploymentHistory =
      formConfig.chapters.educationAndEmploymentHistory.pages;

    it('should render CustomPageReview for applicant highest level of education question', () => {
      const props = {
        data: {
          highestLevelOfEducation: {
            level: "A bachelor's degree",
          },
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <educationAndEmploymentHistory.highestLevelOfEducation.CustomPageReview
          {...props}
        />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should render CustomPageReview for applicant currently employed question', () => {
      const props = {
        data: {
          currentlyEmployed: 'Yes',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <educationAndEmploymentHistory.currentlyEmployed.CustomPageReview
          {...props}
        />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should render CustomPageReview for applicant current annual salary question', () => {
      const props = {
        data: {
          currentAnnualSalary: 'Between $35,001 and $50,000',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <educationAndEmploymentHistory.currentAnnualSalary.CustomPageReview
          {...props}
        />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should render CustomPageReview for applicant working tech industry question', () => {
      const props = {
        data: {
          isWorkingInTechIndustry: 'Yes',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <educationAndEmploymentHistory.isWorkingInTechIndustry.CustomPageReview
          {...props}
        />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
    it('should render CustomPageReview for applicant tech industry focus question', () => {
      const props = {
        data: {
          techIndustryFocusArea: 'Computer software',
        },
        editPage: () => {},
      };

      const wrapper = shallow(
        <educationAndEmploymentHistory.techIndustryFocusArea.CustomPageReview
          {...props}
        />,
      );
      const customPageReviewProps = wrapper.find(CustomPageReview).props();
      expect(customPageReviewProps).to.not.be.undefined;
      expect(customPageReviewProps.data).to.not.be.undefined;
      expect(customPageReviewProps.editPage).to.not.be.undefined;
      wrapper.unmount();
    });
  });
});
