import { expect } from 'chai';
import {
  isOnReviewPage,
  isOnConfirmationPage,
  formConfig,
} from '../../../config/form';
import {
  militaryBranchComponentTypes,
  militaryBranchTypes,
} from '../../../constants/benefits';

describe('Questionnaire Form', () => {
  describe('isOnReviewPage', () => {
    it('should return true if it is the review page', () => {
      const input = {
        pathname: '/review-and-submit',
      };
      expect(isOnReviewPage(input)).to.be.true;
    });
    it('should return false if it is not the review page', () => {
      const input = {
        pathname: '/introduction',
      };
      expect(isOnReviewPage(input)).to.be.false;
    });
  });

  describe('isOnConfirmationPage', () => {
    it('should return true if it is the confirmation page', () => {
      const input = {
        pathname: '/confirmation',
      };
      expect(isOnConfirmationPage(input)).to.be.true;
    });
    it('should return false if it is not the confirmation page', () => {
      const input = {
        pathname: '/introduction',
      };
      expect(isOnConfirmationPage(input)).to.be.false;
    });
  });
});

describe('Questionnaire Form - Title Function', () => {
  describe('title function', () => {
    it('should return "Discover your benefits" by default', () => {
      const { title } = formConfig;
      expect(title).to.equal('Discover your benefits');
    });
  });
});

describe('Questionnaire Form - Chapter 1: Goals', () => {
  const { chapters } = formConfig;
  const { chapter1 } = chapters;
  const goalsPage = chapter1.pages.goals;

  describe('Goals page configuration', () => {
    it('should have the correct path for the goals page', () => {
      expect(goalsPage.path).to.equal('goals');
    });

    it('should have the correct title for the goals page', () => {
      expect(goalsPage.title).to.equal('Goals');
    });

    it('should have a valid uiSchema for the goals page', () => {
      expect(goalsPage.uiSchema).to.be.an('object');
    });
  });
});

describe('Questionnaire Form - Chapter 2: Service', () => {
  const { chapters } = formConfig;
  const { chapter2 } = chapters;
  const { militaryService } = chapter2.pages;
  const militaryServiceCompletedPage = chapter2.pages.militaryServiceCompleted;
  const titleTenActiveDutyPage = chapter2.pages.titleTenActiveDuty;
  const { titleTenTimeServed } = chapter2.pages;
  const armyBranchComponentPage = chapter2.pages[militaryBranchTypes.ARMY];

  describe('depends function for armyBranchComponent', () => {
    it('should return true when army branch is is true', () => {
      const formData = {
        militaryBranch: {
          [militaryBranchTypes.ARMY]: true,
        },
      };
      expect(armyBranchComponentPage.depends(formData)).to.be.true;
    });

    it('should return false when army branch is false', () => {
      const formData = {
        militaryBranch: {
          [militaryBranchTypes.ARMY]: false,
        },
      };
      expect(armyBranchComponentPage.depends(formData)).to.be.false;
    });
  });

  describe('depends function for titleTenActiveDuty', () => {
    it('should return true when nation guard is true.', () => {
      const formData = {
        [militaryBranchTypes.AIR_FORCE]: {
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
        },
      };
      expect(titleTenActiveDutyPage.depends(formData)).to.be.true;
    });

    it('should return true when reserve service is true.', () => {
      const formData = {
        [militaryBranchTypes.AIR_FORCE]: {
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
      };
      expect(titleTenActiveDutyPage.depends(formData)).to.be.true;
    });

    it('should return false when reserve service and national guard are false.', () => {
      const formData = {
        [militaryBranchTypes.AIR_FORCE]: {
          [militaryBranchComponentTypes.RESERVE_SERVICE]: false,
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: false,
        },
      };
      expect(titleTenActiveDutyPage.depends(formData)).to.be.false;
    });

    it('should return false when reserve service and national guard are undefined.', () => {
      expect(titleTenActiveDutyPage.depends({})).to.be.false;
    });
  });

  describe('depends function for titleTenTimeServed', () => {
    it('should return true titleTenActiveDuty is true.', () => {
      const formData = {
        titleTenActiveDuty: true,
      };
      expect(titleTenTimeServed.depends(formData)).to.be.true;
    });
    it('should return false titleTenActiveDuty is false.', () => {
      const formData = {
        titleTenActiveDuty: false,
      };
      expect(titleTenTimeServed.depends(formData)).to.be.false;
    });
    it('should return false titleTenActiveDuty is undefined.', () => {
      expect(titleTenTimeServed.depends({})).to.be.false;
    });
  });

  describe('depends function for militaryServiceCompleted', () => {
    it('should return true if militaryServiceCurrentlyServing is "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: true,
      };
      expect(militaryServiceCompletedPage.depends(formData)).to.be.true;
    });

    it('should return false if militaryServiceCurrentlyServing is not "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: false,
      };
      expect(militaryServiceCompletedPage.depends(formData)).to.be.false;
    });
  });

  describe('onNavForward function for militaryService', () => {
    it('should navigate to discharge page if militaryServiceCurrentlyServing is "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: true,
      };
      const goPathMock = path => {
        expect(path).to.equal(
          formConfig.chapters.chapter4.pages.characterOfDischarge.path,
        );
      };

      militaryService.onNavForward({
        formData,
        goPath: goPathMock,
      });
    });

    it('should call goPath if militaryServiceCurrentlyServing is "No"', () => {
      const formData = {
        militaryServiceCurrentlyServing: 'No',
      };
      let goPathCalled = false;
      let calledWith = '';
      const goPathMock = arg => {
        goPathCalled = true;
        calledWith = arg;
      };

      militaryService.onNavForward({
        formData,
        goPath: goPathMock,
      });

      expect(goPathCalled).to.be.true;
      expect(calledWith).to.equal(
        formConfig.chapters.chapter3.pages.separation.path,
      );
    });
  });

  describe('onNavForward function for militaryServiceCompleted', () => {
    it('should navigate to discharge page if militaryServiceCurrentlyServing is "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: true,
      };
      const goPathMock = path => {
        expect(path).to.equal(
          formConfig.chapters.chapter4.pages.characterOfDischarge.path,
        );
      };

      militaryServiceCompletedPage.onNavForward({
        formData,
        goPath: goPathMock,
      });
    });

    it('should call goPath if militaryServiceCurrentlyServing is "No"', () => {
      const formData = {
        militaryServiceCurrentlyServing: 'No',
      };
      let goPathCalled = false;
      let calledWith = '';
      const goPathMock = arg => {
        goPathCalled = true;
        calledWith = arg;
      };

      militaryServiceCompletedPage.onNavForward({
        formData,
        goPath: goPathMock,
      });

      expect(goPathCalled).to.be.true;
      expect(calledWith).to.equal(
        formConfig.chapters.chapter3.pages.separation.path,
      );
    });
  });

  it('should call goPath if militaryServiceCurrentlyServing is "Yes"', () => {
    const formData = {
      militaryServiceCurrentlyServing: true,
      militaryServiceCompleted: false,
    };
    let goPathCalled = false;
    let calledWith = '';
    const goPathMock = arg => {
      goPathCalled = true;
      calledWith = arg;
    };

    militaryServiceCompletedPage.onNavForward({
      formData,
      goPath: goPathMock,
    });

    expect(goPathCalled).to.be.true;
    expect(calledWith).to.equal(
      formConfig.chapters.chapter4.pages.characterOfDischarge.path,
    );
  });
});

describe('Questionnaire Form - Chapter 3: Seperation', () => {
  const { chapters } = formConfig;
  const { chapter3 } = chapters;
  const separationPage = chapter3.pages.separation;

  describe('Separation page configuration', () => {
    it('should have the correct path for the separation page', () => {
      expect(separationPage.path).to.equal('separation');
    });

    it('should have the correct title for the separation page', () => {
      expect(separationPage.title).to.equal('Separation');
    });

    it('should have a valid uiSchema for the separation page', () => {
      expect(separationPage.uiSchema).to.be.an('object');
    });
  });
});

describe('Questionnaire Form - Chapter 4: Character of Discharge', () => {
  const { chapters } = formConfig;
  const { chapter4 } = chapters;
  const dischargePage = chapter4.pages.characterOfDischarge;

  it('should navigate back to militaryService question if militaryServiceCurrentlyServing is "Yes"', () => {
    const formData = {
      militaryServiceCurrentlyServing: true,
    };
    const goPathMock = path => {
      expect(path).to.equal(
        formConfig.chapters.chapter2.pages.militaryService.path,
      );
    };

    dischargePage.onNavBack({
      formData,
      goPath: goPathMock,
    });
  });

  it('should navigate back to seperation question if militaryServiceCurrentlyServing is "No"', () => {
    const formData = {
      militaryServiceCurrentlyServing: false,
    };
    const goPathMock = path => {
      expect(path).to.equal(formConfig.chapters.chapter3.pages.separation.path);
    };

    dischargePage.onNavBack({
      formData,
      goPath: goPathMock,
    });
  });

  describe('Character of Discharge page configuration', () => {
    it('should have the correct path for the Character of Discharge page', () => {
      expect(dischargePage.path).to.equal('discharge');
    });

    it('should have the correct title for the Character of Discharge page', () => {
      expect(dischargePage.title).to.equal('Character of discharge');
    });

    it('should have a valid uiSchema for the Character of Discharge page', () => {
      expect(dischargePage.uiSchema).to.be.an('object');
    });
  });
});

describe('Questionnaire Form - Chapter 5: Disability', () => {
  const { chapters } = formConfig;
  const { chapter5 } = chapters;
  const disabilityPage = chapter5.pages.disabilityRating;

  describe('Disability page configuration', () => {
    it('should have the correct path for the Disability page', () => {
      expect(disabilityPage.path).to.equal('disability');
    });

    it('should have the correct title for the Disability page', () => {
      expect(disabilityPage.title).to.equal('Disability');
    });

    it('should have a valid uiSchema for the Disability page', () => {
      expect(disabilityPage.uiSchema).to.be.an('object');
    });
  });
});
