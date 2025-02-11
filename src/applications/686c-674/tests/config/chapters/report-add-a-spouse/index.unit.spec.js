import { expect } from 'chai';
import { formConfig } from '../../../../config/form';

describe('Add Spouse Chapter', () => {
  it('should include pages only when formData.view:addOrRemoveDependents.add is true', () => {
    const formDataWithAdd = {
      'view:addOrRemoveDependents': { add: true },
      'view:addDependentsOptions': { addSpouse: true },
      'view:selectable686Options': { addSpouse: true },
    };

    const chapter = formConfig.chapters.addSpouse;
    const addSpouseData = Object.entries(chapter.pages);

    addSpouseData.forEach(([_key, page]) => {
      const expected = page.depends(formDataWithAdd);
      if (!expected || expected !== true) {
        return;
      }
      expect(expected).to.be.true;
    });
  });

  it('should include pages only when formData.view:addOrRemoveDependents.add is true', () => {
    const formDataWithAdd = {
      'view:addOrRemoveDependents': { add: true },
      'view:addDependentsOptions': { addSpouse: true },
      'view:selectable686Options': { addSpouse: true },
      addSpouse: [
        {
          doesLiveWithSpouse: { spouseDoesLiveWithVeteran: true },
        },
      ],
    };

    const chapter = formConfig.chapters.addSpouse;
    const addSpouseData = Object.entries(chapter.pages);

    addSpouseData.forEach(([_key, page]) => {
      const expected = page.depends(formDataWithAdd, 0);
      if (!expected || expected !== true) {
        return;
      }
      expect(expected).to.be.true;
    });
  });
});
