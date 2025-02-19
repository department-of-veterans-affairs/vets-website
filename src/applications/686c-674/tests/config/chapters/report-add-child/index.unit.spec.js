import { expect } from 'chai';
import { chapter } from '../../../../config/chapters/report-add-child';

describe('Add Child Chapter', () => {
  // TODO: Replace after refactor. Temp removed.

  // it.skip('should include pages only when formData.view:addOrRemoveDependents.add is true', () => {
  //   const formDataWithAdd = {
  //     'view:addOrRemoveDependents': { add: true },
  //     'view:addDependentsOptions': { addChild: true },
  //     'view:selectable686Options': { addChild: true },
  //   };

  //   const formDataWithoutAdd = {
  //     'view:addOrRemoveDependents': { add: false },
  //     'view:addDependentsOptions': { addChild: true },
  //     'view:selectable686Options': { addChild: true },
  //   };

  //   const addChildMarriageDetails = Object.entries(chapter.pages).filter(
  //     ([key]) => key === 'addChildMarriageEndDetails',
  //   );
  //   const remainder = Object.entries(chapter.pages).filter(
  //     ([key]) => key !== 'addChildMarriageEndDetails',
  //   );

  //   remainder.forEach(([_key, page]) => {
  //     expect(page.depends(formDataWithAdd)).to.be.true;
  //     expect(page.depends(formDataWithoutAdd)).to.be.false;
  //   });
  //   addChildMarriageDetails.forEach(([_key, page]) => {
  //     expect(
  //       page.depends({
  //         'view:addOrRemoveDependents': { add: true },
  //         'view:selectable686Options': { addChild: false },
  //       }),
  //     ).to.be.false;
  //   });
  // });

  it('should use proper depends', () => {
    const formDataWithAdd = {
      'view:addOrRemoveDependents': { add: true },
      'view:addDependentsOptions': { addChild: true },
      'view:selectable686Options': { addChild: true },
      childrenToAdd: [
        {
          relationshipToChild: { stepchild: true },
          doesChildLiveWithYou: false,
          hasChildEverBeenMarried: true,
        },
      ],
    };

    Object.entries(chapter.pages).forEach(([_key, page]) => {
      if (page.depends) {
        expect(page.depends(formDataWithAdd, 0)).to.be.true;
      }
    });
  });
});
