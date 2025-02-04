import { expect } from 'chai';
import { chapter } from '../../../../config/chapters/report-add-child';

describe('Add Child Chapter', () => {
  it('should include pages only when formData.view:addOrRemoveDependents.add is true', () => {
    const formDataWithAdd = {
      'view:addOrRemoveDependents': { add: true },
      'view:addDependentsOptions': { addChild: true },
      'view:selectable686Options': { addChild: true },
    };

    const formDataWithoutAdd = {
      'view:addOrRemoveDependents': { add: false },
      'view:addDependentsOptions': { addChild: true },
      'view:selectable686Options': { addChild: true },
    };

    Object.entries(chapter.pages).forEach(([_key, page]) => {
      if (page.depends) {
        expect(page.depends(formDataWithAdd)).to.be.true;

        expect(page.depends(formDataWithoutAdd)).to.be.false;
      }
    });
  });
});
