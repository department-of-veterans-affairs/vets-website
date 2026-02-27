import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/dependentsResidence';

describe('Dependents Residence page', () => {
  const { uiSchema } = page;

  it('displays residenceAlert if hideIf returns true when childrenLiveTogetherButNotWithSpouse is Yes', () => {
    const itemYes = {
      veteranChildrenCount: '1',
      childrenLiveTogetherButNotWithSpouse: 'Yes',
    };
    const itemNo = {
      veteranChildrenCount: '1',
      childrenLiveTogetherButNotWithSpouse: 'No',
    };
    const none = { veteranChildrenCount: '0' };

    expect(uiSchema, 'dependentsResidence uiSchema not found').to.exist;
    const alertOptions = uiSchema.residenceAlert['ui:options'];
    expect(alertOptions, 'residenceAlert options not found').to.exist;

    expect(alertOptions.hideIf(itemYes)).to.be.true;
    expect(alertOptions.hideIf(itemNo)).to.be.false;
    expect(alertOptions.hideIf(none)).to.be.false;
  });
});
