import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import {
  DownloadLink,
  MilitaryBaseInfo,
  ServerErrorAlert,
  aboutMyselfRelationshipFamilyMemberCondition,
  aboutMyselfRelationshipVeteranCondition,
  aboutSomeoneElseRelationshipConnectedThroughWorkCondition,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition,
  aboutSomeoneElseRelationshipFamilyMemberCondition,
  aboutSomeoneElseRelationshipVeteranCondition,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition,
  contactRules,
  convertDateForInquirySubheader,
  formatDate,
  generalQuestionCondition,
  getContactMethods,
  getDescriptiveTextFromCRM,
  getFiles,
  getHealthFacilityTitle,
  getVAStatusFromCRM,
  isBranchOfServiceRequired,
  isEducationNonVRE,
  isEqualToOnlyEmail,
  isHealthFacilityRequired,
  isLocationOfResidenceRequired,
  isOutsideUSEducation,
  isPostalCodeRequired,
  isStateOfPropertyRequired,
  isVRERequired,
  whoIsYourQuestionAboutCondition,
} from '../../config/helpers';
// import { CategoryGuardianshipCustodianshipFiduciaryIssues } from '../../config/constants';
import {
  CHAPTER_3,
  CategoryBenefitsIssuesOutsidetheUS,
  CategoryEducation,
  CategoryGuardianshipCustodianshipFiduciaryIssues,
  CategoryHealthCare,
  CategoryHousingAssistanceAndHomeLoans,
  CategoryVeteranReadinessAndEmployment,
  TopicAppraisals,
  TopicDisabilityCompensation,
  TopicEducationBenefitsAndWorkStudy,
  TopicSpeciallyAdapatedHousing,
  TopicVeteranReadinessAndEmploymentChapter31,
  branchOfServiceRuleforCategories,
  contactOptions,
  isQuestionAboutVeteranOrSomeoneElseLabels,
  relationshipOptionsMyself,
  relationshipOptionsSomeoneElse,
  whoIsYourQuestionAboutLabels,
} from '../../constants';

describe('Components and Utility Functions', () => {
  describe('contactRules object', () => {
    it('should contain correct contact methods for "Benefits issues outside the U.S." and "Disability compensation"', () => {
      expect(contactRules['Benefits issues outside the U.S.']).to.have.property(
        'Disability compensation',
      );
      expect(
        contactRules['Benefits issues outside the U.S.'][
          'Disability compensation'
        ],
      ).to.include.members(['EMAIL', 'PHONE', 'US_MAIL']);
    });

    it('should contain correct contact methods for "Education benefits and work study" and "Work study"', () => {
      expect(
        contactRules['Education benefits and work study'],
      ).to.have.property('Work study');
      expect(
        contactRules['Education benefits and work study']['Work study'],
      ).to.include.members(['EMAIL']);
    });
  });

  describe('getContactMethods', () => {
    it('should return correct methods for a given category and topic', () => {
      const methods = getContactMethods(['Email', 'Phone', 'USMail']);
      expect(methods).to.deep.equal({
        EMAIL: 'Email',
        PHONE: 'Phone call',
        US_MAIL: 'U.S. mail',
      });
    });

    it('should return all methods if category or topic contact preferences not found', () => {
      const methods = getContactMethods();
      expect(methods).to.deep.equal({
        EMAIL: 'Email',
        PHONE: 'Phone call',
        US_MAIL: 'U.S. mail',
      });
    });
  });

  describe('isEqualToOnlyEmail', () => {
    it('should return true if the object contains only EMAIL key with value "Email"', () => {
      const result = isEqualToOnlyEmail({ EMAIL: 'Email' });
      expect(result).to.be.true;
    });

    it('should return false if the object contains more than one method', () => {
      const result = isEqualToOnlyEmail({
        EMAIL: 'Email',
        PHONE: 'Phone call',
      });
      expect(result).to.be.false;
    });

    it('should return false if the object contains only EMAIL but with incorrect value', () => {
      const result = isEqualToOnlyEmail({ EMAIL: 'Incorrect' });
      expect(result).to.be.false;
    });
  });

  describe('Various helper widgets are renderable', () => {
    it('should render ServerErrorAlert correctly', () => {
      const wrapper = shallow(<ServerErrorAlert />);
      expect(wrapper.exists()).to.be.true;
      wrapper.unmount();
    });

    it('should render MilitaryBaseInfo correctly', () => {
      const wrapper = shallow(<MilitaryBaseInfo />);
      expect(wrapper.exists()).to.be.true;
      wrapper.unmount();
    });
  });

  describe('isLocationOfResidenceRequired', () => {
    it('should return false if the contact preference is comtactOptions.US_MAIL', () => {
      const result = isLocationOfResidenceRequired({
        contactPreference: contactOptions.US_MAIL,
      });
      expect(result).to.be.false;
    });

    describe('should return true if the location of residence is required', () => {
      it('required for Flow 1.1', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryGuardianshipCustodianshipFiduciaryIssues,
          selectTopic: "ANYTHIING EXCEPT 'Other'",
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 1.2', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.1', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.2.1', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.2.2', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.3', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.WORK,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 3.1', () => {
        const result = isLocationOfResidenceRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
        });
        expect(result).to.be.true;
      });

      it('not required for other cases', () => {
        const result = isLocationOfResidenceRequired({});
        expect(result).to.be.false;
      });
    });
  });

  describe('isPostalCodeRequired', () => {
    it('should return false if the contact preference is contactOptions.US_MAIL', () => {
      const result = isPostalCodeRequired({
        contactPreference: contactOptions.US_MAIL,
      });
      expect(result).to.be.false;
    });

    describe('should return true if the postal code is required', () => {
      it('required for Flow 1.1, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryGuardianshipCustodianshipFiduciaryIssues,
          selectTopic: "ANYTHIING EXCEPT 'Other'",
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
          yourLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 1.1, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: "ANYTHIING EXCEPT 'Other'",
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 1.2, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          yourLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 1.2, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.1, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
          familyMembersLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.1, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.2.1, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
          veteransLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.2.1, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.2.2, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE,
          familyMembersLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.2.2, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.3, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.WORK,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
          veteransLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 2.3, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.WORK,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('required for Flow 3.1, part 1', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
          yourLocationOfResidence: 'Texas',
        });
        expect(result).to.be.true;
      });

      it('required for Flow 3.1, part 2', () => {
        const result = isPostalCodeRequired({
          contactPreference: 'EMAIL',
          selectCategory: CategoryHealthCare,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
          yourHealthFacility: null,
        });
        expect(result).to.be.true;
      });

      it('not required for other cases', () => {
        const result = isPostalCodeRequired({});
        expect(result).to.be.false;
      });
    });
  });

  describe('should return true if the state of property is required', () => {
    it('required for CategoryHousingAssistanceAndHomeLoans and TopicSpeciallyAdapatedHousing', () => {
      const result = isStateOfPropertyRequired({
        selectCategory: CategoryHousingAssistanceAndHomeLoans,
        selectTopic: TopicSpeciallyAdapatedHousing,
      });
      expect(result).to.be.true;
    });

    it('required for CategoryHousingAssistanceAndHomeLoans and TopicAppraisals', () => {
      const result = isStateOfPropertyRequired({
        selectCategory: CategoryHousingAssistanceAndHomeLoans,
        selectTopic: TopicAppraisals,
      });
      expect(result).to.be.true;
    });
  });

  describe('isBranchOfServiceRequired', () => {
    it('should return true for branch of service categories when not GENERAL', () => {
      branchOfServiceRuleforCategories.forEach(category => {
        const result = isBranchOfServiceRequired({
          selectCategory: category,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
        });
        expect(result).to.be.true;
      });
    });

    it('should return false for branch of service categories when GENERAL', () => {
      branchOfServiceRuleforCategories.forEach(category => {
        const result = isBranchOfServiceRequired({
          selectCategory: category,
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
        });
        expect(result).to.be.false;
      });
    });

    it('should return true for Benefits Issues Outside US with Disability Compensation when not GENERAL', () => {
      const result = isBranchOfServiceRequired({
        selectCategory: CategoryBenefitsIssuesOutsidetheUS,
        selectTopic: TopicDisabilityCompensation,
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
      });
      expect(result).to.be.true;
    });

    it('should return false for Benefits Issues Outside US with Disability Compensation when GENERAL', () => {
      const result = isBranchOfServiceRequired({
        selectCategory: CategoryBenefitsIssuesOutsidetheUS,
        selectTopic: TopicDisabilityCompensation,
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
      });
      expect(result).to.be.false;
    });

    it('should return false for Benefits Issues Outside US with non-Disability Compensation topic', () => {
      const result = isBranchOfServiceRequired({
        selectCategory: CategoryBenefitsIssuesOutsidetheUS,
        selectTopic: 'Some Other Topic',
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
      });
      expect(result).to.be.false;
    });
  });

  describe('isVRERequired is as expected', () => {
    it('true for VRE category', () => {
      expect(
        isVRERequired({
          selectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
        }),
      ).to.be.true;
      expect(
        isVRERequired({
          selectCategory: CategoryVeteranReadinessAndEmployment,
        }),
      ).to.be.true;
      expect(
        isVRERequired({
          selectCategory: CategoryHealthCare,
        }),
      ).to.be.false;
    });
  });

  describe('isHealthFacilityRequired is as expected', () => {
    it('true for expected topics', () => {
      const healthTopics = [
        'Prosthetics',
        'Audiology and hearing aids',
        'Getting care at a local VA medical center',
      ];
      healthTopics.forEach(topic => {
        expect(
          isHealthFacilityRequired({
            selectCategory: CategoryHealthCare,
            selectTopic: topic,
          }),
        ).to.be.true;
      });
      expect(
        isHealthFacilityRequired({
          selectCategory:
            'Debt for benefit overpayments and health care copay bills',
          selectTopic: 'Health care copay debt',
        }),
      ).to.be.true;
      expect(
        isHealthFacilityRequired({
          selectCategory:
            'Debt for benefit overpayments and health care copay bills',
          selectTopic: 'SOMETHING ELSE',
        }),
      ).to.be.false;
      expect(
        isHealthFacilityRequired({
          selectCategory: CategoryHealthCare,
          selectTopic: 'SOMETHING ELSE',
        }),
      ).to.be.false;
    });
  });

  describe('getHealthFacilityTitle values', () => {
    it('returns proper facility title', () => {
      expect(
        getHealthFacilityTitle({
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
        }),
      ).to.equal(CHAPTER_3.YOUR_VA_HEALTH_FACILITY.TITLE);
      expect(
        getHealthFacilityTitle({
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
        }),
      ).to.equal(CHAPTER_3.YOUR_VA_HEALTH_FACILITY.TITLE);

      expect(
        getHealthFacilityTitle({
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.VETERAN,
        }),
      ).to.equal(CHAPTER_3.FAMILY_MEMBER_VA_HEALTH_FACILITY.TITLE);

      expect(
        getHealthFacilityTitle({
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
        }),
      ).to.equal(CHAPTER_3.VETERAN_VA_HEALTH_FACILITY.TITLE);

      expect(
        getHealthFacilityTitle({
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.FAMILY_MEMBER,
          isQuestionAboutVeteranOrSomeoneElse:
            isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE,
        }),
      ).to.equal(CHAPTER_3.FAMILY_MEMBER_VA_HEALTH_FACILITY.TITLE);

      expect(
        getHealthFacilityTitle({
          whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
          relationshipToVeteran: relationshipOptionsSomeoneElse.WORK,
        }),
      ).to.equal(CHAPTER_3.VETERAN_VA_HEALTH_FACILITY.TITLE);

      expect(getHealthFacilityTitle({})).to.equal(
        CHAPTER_3.YOUR_VA_HEALTH_FACILITY.TITLE,
      );
    });
  });

  describe('getVAStatusFromCRM values', () => {
    const scenarios = {
      'In progress': [
        'new',
        'in progress',
        'inprogress',
        'In progress',
        // default:
        'ANY_OTHER_VALUE',
      ],
      Replied: ['solved', 'replied'],
      Reopened: ['reopened'],
      Closed: ['closed'],
      "We didn't find any questions with this reference number. Check your reference number and try again.": [
        'question not found',
        'questionnotfound',
      ],
    };
    it('returns proper Ask VA va.gov statuses', () => {
      Object.keys(scenarios).forEach(vaStatus => {
        scenarios[vaStatus].forEach(crmStatus => {
          expect(getVAStatusFromCRM(crmStatus)).to.equal(vaStatus);
        });
      });
    });
  });

  describe('getDescriptiveTextFromCRM values', () => {
    const scenarios = {
      new: 'Your inquiry is current in queue to be reviewed.',
      'in progress': 'Your inquiry is currently being reviewed by an agent.',
      solved:
        'Your inquiry has been closed. If you have additional questions open a new inquiry.',
      reopened:
        'Your reply to this inquiry has been received, and the inquiry is currently being reviewed by an agent.',
      closed: 'Closed.',
      'reference number not found':
        "No Results found. We could not locate an inquiry that matches your ID. Check the number and re-enter. If you receive this message again, you can submit a new inquiry with your original question. Include your old inquiry number for reference and we'll work to get your question fully answered.",
      'ANY OTHER VALUE': 'error',
    };
    it('returns proper descriptive text', () => {
      Object.keys(scenarios).forEach(crmStatus => {
        expect(getDescriptiveTextFromCRM(crmStatus)).to.equal(
          scenarios[crmStatus],
        );
      });
      expect(getDescriptiveTextFromCRM(null)).to.equal('error');
    });
  });

  // describe('convertDateForInquirySubheader values', () => {
  //   it('returns proper descriptive text', () => {
  //     const dates = {
  //       '2023-10-10T12:00:00': 'October 10, 2023 at 12:00 XM',
  //     };
  //     it('returns proper UTC dates from string', () => {
  //       Object.keys(dates).forEach(date => {
  //         expect(convertDateForInquirySubheader(date)).to.equal(dates[date]);
  //       });
  //     });
  //   });
  // });

  describe('"Condition" values', () => {
    const formDataVariants = {
      educationNonVRE: {
        selectCategory: CategoryEducation,
        selectTopic:
          'ANYTHING EXCEPT TopicVeteranReadinessAndEmploymentChapter31',
      },
      outsideUSEducation: {
        selectCategory: CategoryBenefitsIssuesOutsidetheUS,
        selectTopic: TopicEducationBenefitsAndWorkStudy,
      },
    };

    it('isEducationNonVRE returns proper values', () => {
      expect(isEducationNonVRE(formDataVariants.educationNonVRE)).to.be.true;
      expect(
        isEducationNonVRE({
          ...formDataVariants.educationNonVRE,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
        }),
      ).to.be.false;
    });

    it('outsideUSEducation returns proper values', () => {
      expect(isOutsideUSEducation(formDataVariants.outsideUSEducation)).to.be
        .true;
      expect(isOutsideUSEducation({ slectCategory: CategoryHealthCare })).to.be
        .false;
    });

    it('whoIsYourQuestionAboutCondition returns proper values', () => {
      expect(whoIsYourQuestionAboutCondition(formDataVariants.educationNonVRE))
        .to.be.false;
      expect(
        whoIsYourQuestionAboutCondition(formDataVariants.outsideUSEducation),
      ).to.be.false;
      expect(
        whoIsYourQuestionAboutCondition({ slectCategory: CategoryHealthCare }),
      ).to.be.true;
    });

    it('aboutMyselfRelationshipVeteranCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
        relationshipToVeteran: relationshipOptionsMyself.VETERAN,
      };
      expect(aboutMyselfRelationshipVeteranCondition(formData)).to.be.true;
      expect(
        aboutMyselfRelationshipVeteranCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than MYSELF',
        }),
      ).to.be.false;
      expect(
        aboutMyselfRelationshipVeteranCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than VETERAN',
        }),
      ).to.be.false;
    });

    it('aboutMyselfRelationshipFamilyMemberCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
        relationshipToVeteran: relationshipOptionsMyself.FAMILY_MEMBER,
      };
      expect(aboutMyselfRelationshipFamilyMemberCondition(formData)).to.be.true;
      expect(
        aboutMyselfRelationshipFamilyMemberCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than MYSELF',
        }),
      ).to.be.false;
      expect(
        aboutMyselfRelationshipFamilyMemberCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than FAMILY_MEMBER',
        }),
      ).to.be.false;
    });

    it('aboutSomeoneElseRelationshipVeteranCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
        relationshipToVeteran: relationshipOptionsMyself.VETERAN,
        ...formDataVariants.educationNonVRE,
        selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
      };
      expect(aboutSomeoneElseRelationshipVeteranCondition(formData)).to.be.true;
      expect(
        aboutSomeoneElseRelationshipVeteranCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than SOMEONE_ELSE',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipVeteranCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than VETERAN',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipVeteranCondition({
          ...formData,
          slectCategory: 'Anything other than EDUCATION',
        }),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipVeteranCondition({
          ...formData,
          slectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
        }),
      ).to.be.true;
    });

    it('aboutSomeoneElseRelationshipFamilyMemberCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
        relationshipToVeteran: relationshipOptionsMyself.FAMILY_MEMBER,
        ...formDataVariants.educationNonVRE,
        selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
      };
      expect(aboutSomeoneElseRelationshipFamilyMemberCondition(formData)).to.be
        .true;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than SOMEONE_ELSE',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than FAMILY_MEMBER',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberCondition({
          ...formData,
          slectCategory: 'Anything other than EDUCATION',
        }),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberCondition({
          ...formData,
          slectCategory: CategoryEducation,
          selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
        }),
      ).to.be.true;
    });

    it('aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
        relationshipToVeteran: relationshipOptionsMyself.FAMILY_MEMBER,
        isQuestionAboutVeteranOrSomeoneElse:
          isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN,
      };
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition(formData),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than SOMEONE_ELSE',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than FAMILY_MEMBER',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition({
          ...formData,
          isQuestionAboutVeteranOrSomeoneElse: 'Anything other than VETERAN',
        }),
      ).to.be.false;
    });

    it('aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
        relationshipToVeteran: relationshipOptionsMyself.FAMILY_MEMBER,
        isQuestionAboutVeteranOrSomeoneElse:
          isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE,
      };
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition(
          formData,
        ),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than SOMEONE_ELSE',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than FAMILY_MEMBER',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition({
          ...formData,
          isQuestionAboutVeteranOrSomeoneElse:
            'Anything other than SOMEONE_ELSE',
        }),
      ).to.be.false;
    });

    it('aboutSomeoneElseRelationshipConnectedThroughWorkCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.SOMEONE_ELSE,
        relationshipToVeteran: relationshipOptionsSomeoneElse.WORK,
        selectCategory: CategoryEducation,
        selectTopic: TopicVeteranReadinessAndEmploymentChapter31,
      };
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkCondition(formData),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkCondition({
          ...formData,
          whoIsYourQuestionAbout: 'Anything other than SOMEONE_ELSE',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkCondition({
          ...formData,
          relationshipToVeteran: 'Anything other than WORK',
        }),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkCondition({
          ...formData,
          selectCategory: 'Anything other than Education',
        }),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkCondition({
          ...formData,
          selectTopic: 'Anything other than VRE-Chapter31',
        }),
      ).to.be.false;
    });

    it('aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition returns proper values', () => {
      const formData = {
        relationshipToVeteran: relationshipOptionsSomeoneElse.WORK,
        selectCategory: CategoryHealthCare,
      };
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition(
          formData,
        ),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition({
          ...formData,
          ...formDataVariants.educationNonVRE,
        }),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition({
          ...formData,
          ...formDataVariants.outsideUSEducation,
        }),
      ).to.be.true;
    });

    it('aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition returns proper values', () => {
      const formData = {
        relationshipToVeteran: 'Anything except WORK',
        selectCategory: CategoryHealthCare,
      };
      expect(
        aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition(
          formData,
        ),
      ).to.be.false;
      expect(
        aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition({
          ...formData,
          ...formDataVariants.educationNonVRE,
        }),
      ).to.be.true;
      expect(
        aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition({
          ...formData,
          ...formDataVariants.outsideUSEducation,
        }),
      ).to.be.true;
    });

    it('generalQuestionCondition returns proper values', () => {
      const formData = {
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.GENERAL,
      };
      expect(generalQuestionCondition(formData)).to.be.true;
      expect(
        generalQuestionCondition({
          whoIsYourQuestionAbout: 'Anything except GENERAL',
        }),
      ).to.be.false;
    });
  });

  describe('getFiles', () => {
    it('returns an array with one empty (null-value) file object', () => {
      const expected = [{ FileName: null, FileContent: null }];
      expect(getFiles(null)).to.deep.equal(expected);
      expect(getFiles(undefined)).to.deep.equal(expected);
      // // TODO: I believe this is a bug/inconsistency in the app, but unsure
      // // likelihood of encountering in the wild. Personally, I'd rather see
      // // an empty array returned in these three cases. -- joehall-tw
      // expect(getFiles([])).to.deep.equal(expected);
    });

    it('returns an array of file object(s)', () => {
      const input = [{ fileName: 'foo.jpg', base64: 'blah' }];
      const expected = [{ FileName: 'foo.jpg', FileContent: 'blah' }];
      expect(getFiles(input)).to.deep.equal(expected);

      input.push({ fileName: 'bar.jpg', base64: 'blah blah' });
      expected.push({ FileName: 'bar.jpg', FileContent: 'blah blah' });
      expect(getFiles(input)).to.deep.equal(expected);
    });
  });

  describe('formatDate', () => {
    // const today = new Date();
    // const todayAsString = `${today.getMonth() + 1}/${today.getDay()}/${today.getFullYear()}`;
    it('returns a well-formed date', () => {
      expect(formatDate('02/2/2023')).to.equal('Feb 2, 2023');
      expect(formatDate('02/2/2023', 'long')).to.equal('February 2, 2023');

      // TODO: I believe this is a bug in the app. We shouldn't return the
      // dateString, as-is, when the validation fails. -- joehall-tw
      expect(formatDate('02/31/2023')).to.equal('02/31/2023');
      expect(formatDate('hamburger')).to.equal('hamburger');
    });
  });

  describe('DownloadLink', () => {
    it('should render DownloadLink correctly with non-empty file data', () => {
      const wrapper = shallow(
        DownloadLink({
          fileUrl: 'http://foo.bar',
          fileName: 'foo.pdf',
          fileSize: 200000000,
        }),
      );
      expect(wrapper.exists()).to.be.true;
      expect(wrapper.find('a').prop('href')).to.equal('http://foo.bar');
      expect(wrapper.find('a').prop('download')).to.equal('foo.pdf');
      expect(wrapper.find('a').text()).to.equal('foo.pdf (190.73 MB)');
      wrapper.unmount();
    });

    it('should render DownloadLink correctly with no file data', () => {
      const wrapper = shallow(
        DownloadLink({
          fileUrl: 'http://foo.bar',
          fileName: 'foo.pdf',
          fileSize: 0,
        }),
      );
      expect(wrapper.exists()).to.be.true;
      expect(wrapper.find('a').prop('href')).to.equal('http://foo.bar');
      expect(wrapper.find('a').prop('download')).to.equal('foo.pdf');
      expect(wrapper.find('a').text()).to.equal('foo.pdf');
      wrapper.unmount();
    });
  });

  describe('convertDateForInquirySubheader', () => {
    it('handles well-formed dateString', () => {
      // eslint-disable-next-line no-console
      expect(convertDateForInquirySubheader('2/12/2023 12:00:00 AM')).to.equal(
        'Feb. 11, 2023 at 7:00 p.m. E.T',
      );
    });

    it('handles poorly-formed dateString', () => {
      expect(convertDateForInquirySubheader('2/13/-234')).to.equal(
        'Invalid Date',
      );
      expect(convertDateForInquirySubheader('pizza')).to.equal('Invalid Date');
      expect(convertDateForInquirySubheader('2023-99-99 99:99:99')).to.equal(
        'Invalid Date',
      );
    });
  });
});
