import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Form 22-1995', () => {
  describe('Chapter 4: School selection', () => {
    const { chapters } = formConfig;
    const { schoolSelection } = chapters;
    const newSchoolPage = schoolSelection.pages.newSchool;

    describe('depends function for rudisillReview', () => {
      it('should return false if rudisillReview is "Yes"', () => {
        const formData = { rudisillReview: 'Yes' };
        expect(newSchoolPage.depends(formData)).to.be.false;
      });

      it('should return true if rudisillReview is "No"', () => {
        const formData = { rudisillReview: 'No' };
        expect(newSchoolPage.depends(formData)).to.be.true;
      });

      it('should return true if rudisillReview is not select (Rudisill feature toggle off)', () => {
        const formData = { rudisillReview: undefined };
        expect(newSchoolPage.depends(formData)).to.be.true;
      });
    });
  });
});
