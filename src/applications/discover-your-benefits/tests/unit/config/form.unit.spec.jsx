import { expect } from 'chai';
import {
  isOnReviewPage,
  isOnConfirmationPage,
  formConfig,
} from '../../../config/form';

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
  const militaryServiceCompletedPage = chapter2.pages.militaryServiceCompleted;

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

  describe('onNavForward function for militaryServiceCompleted', () => {
    it('should navigate to separation page if militaryServiceCurrentlyServing is "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: true,
      };
      const goPathMock = path => {
        expect(path).to.equal(
          formConfig.chapters.chapter3.pages.separation.path,
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

  describe('Character of Discharge page configuration', () => {
    it('should have the correct path for the Character of Discharge page', () => {
      expect(dischargePage.path).to.equal('discharge');
    });

    it('should have the correct title for the Character of Discharge page', () => {
      expect(dischargePage.title).to.equal('Character of Discharge');
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
      expect(disabilityPage.title).to.equal('Disability Rating');
    });

    it('should have a valid uiSchema for the Disability page', () => {
      expect(disabilityPage.uiSchema).to.be.an('object');
    });
  });
});
