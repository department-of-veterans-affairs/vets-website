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
    it('should return "Your benefits and resources" when on the confirmation page', () => {
      const currentLocation = { pathname: '/confirmation' };
      const title = formConfig.title({ currentLocation });
      expect(title).to.equal('Your benefits and resources');
    });

    it('should return "Review your entries" when on the review page', () => {
      const currentLocation = { pathname: '/review-and-submit' };
      const title = formConfig.title({ currentLocation });
      expect(title).to.equal('Review your entries');
    });

    it('should return "Benefit and resource recommendation tool" by default', () => {
      const currentLocation = { pathname: '/some-other-page' };
      const title = formConfig.title({ currentLocation });
      expect(title).to.equal('Benefit and resource recommendation tool');
    });
  });
});

describe('Questionnaire Form - SubTitle Function', () => {
  describe('title function', () => {
    it('should return blank when on the confirmation page', () => {
      const currentLocation = { pathname: '/confirmation' };
      const title = formConfig.subTitle({ currentLocation });
      expect(title).to.equal('');
    });

    it('should return blank when on the review page', () => {
      const currentLocation = { pathname: '/review-and-submit' };
      const title = formConfig.subTitle({ currentLocation });
      expect(title).to.equal('');
    });

    it('should return "Please answer the questions to help us recommend helpful resources and benefits." by default', () => {
      const currentLocation = { pathname: '/some-other-page' };
      const title = formConfig.subTitle({ currentLocation });
      expect(title).to.equal(
        'Please answer the questions to help us recommend helpful resources and benefits.',
      );
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
        militaryServiceCurrentlyServing: 'Yes',
      };
      expect(militaryServiceCompletedPage.depends(formData)).to.be.true;
    });

    it('should return false if militaryServiceCurrentlyServing is not "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: 'No',
      };
      expect(militaryServiceCompletedPage.depends(formData)).to.be.false;
    });
  });

  describe('onNavForward function for militaryServiceCompleted', () => {
    it('should navigate to separation page if militaryServiceCurrentlyServing is "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: 'Yes',
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

    it('should not call goPath if militaryServiceCurrentlyServing is not "Yes"', () => {
      const formData = {
        militaryServiceCurrentlyServing: 'No',
      };
      let goPathCalled = false;
      const goPathMock = () => {
        goPathCalled = true;
      };

      militaryServiceCompletedPage.onNavForward({
        formData,
        goPath: goPathMock,
      });
      expect(goPathCalled).to.be.false;
    });
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

describe('Questionnaire Form - Chapter 6: GI Bill Status', () => {
  const { chapters } = formConfig;
  const { chapter6 } = chapters;
  const giBillPage = chapter6.pages.giBillStatus;

  describe('GI Bill Status page configuration', () => {
    it('should have the correct path for the GI Bill Status page', () => {
      expect(giBillPage.path).to.equal('gi-bill');
    });

    it('should have the correct title for the GI Bill Status page', () => {
      expect(giBillPage.title).to.equal('GI Bill Status');
    });

    it('should have a valid uiSchema for the GI Bill Status page', () => {
      expect(giBillPage.uiSchema).to.be.an('object');
    });
  });
});
