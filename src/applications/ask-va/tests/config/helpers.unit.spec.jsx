import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import {
  contactRules,
  getContactMethods,
  isEqualToOnlyEmail,
  MilitaryBaseInfo,
  ServerErrorAlert,
  isLocationOfResidenceRequired,
  isPostalCodeRequired,
  isStateOfPropertyRequired,
  isBranchOfServiceRequired,
  isVRERequired,
  isHealthFacilityRequired,
  getHealthFacilityTitle,
} from '../../config/helpers';
// import { CategoryGuardianshipCustodianshipFiduciaryIssues } from '../../config/constants';
import {
  CategoryEducation,
  isQuestionAboutVeteranOrSomeoneElseLabels,
  relationshipOptionsSomeoneElse,
  TopicVeteranReadinessAndEmploymentChapter31,
  whoIsYourQuestionAboutLabels,
  CategoryGuardianshipCustodianshipFiduciaryIssues,
  contactOptions,
  CategoryHealthCare,
  CategoryHousingAssistanceAndHomeLoans,
  TopicSpeciallyAdapatedHousing,
  TopicAppraisals,
  CategoryVeteranReadinessAndEmployment,
  CHAPTER_3,
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
      const methods = getContactMethods(
        'Disability compensation',
        'Aid and Attendance or Housebound benefits',
      );
      expect(methods).to.deep.equal({
        EMAIL: 'Email',
        PHONE: 'Phone call',
        US_MAIL: 'U.S. mail',
      });
    });

    it('should return all methods if category or topic not found', () => {
      const methods = getContactMethods(
        'Nonexistent Category',
        'Nonexistent Topic',
      );
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

  describe('should return true if branch of service category selected and whoIsYourQuestionAbout is not GENERAL', () => {
    const branchOfServiceCategories = [
      'Veteran ID Card (VIC)',
      'Disability compensation',
      'Survivor benefits',
      'Burials and memorials',
      'Center for Women Veterans',
      'Benefits issues outside the U.S.',
    ];

    it('required for branch of service categories', () => {
      branchOfServiceCategories.forEach(category => {
        const result = isBranchOfServiceRequired({
          selectCategory: category,
          whoIsYourQuestionAbout: `anything except ${
            whoIsYourQuestionAboutLabels.GENERAL
          }`,
        });
        expect(result).to.be.true;
      });
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
});
