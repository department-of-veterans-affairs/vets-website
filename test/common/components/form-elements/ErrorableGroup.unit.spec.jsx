import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ErrorableGroup from '../../../../src/js/common/components/form-elements/ErrorableGroup';


describe('<ErrorableGroup>', () => {
  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableGroup
          required
          validation
          errorMessage="Test">
        <first/><second/>
      </ErrorableGroup>
    );
    expect(tree.everySubTree('first')).to.have.lengthOf(1);
    expect(tree.everySubTree('second')).to.have.lengthOf(1);
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
  });

  it('shows error message when invalid', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableGroup
          required
          validation={false}
          isDirty
          errorMessage="Test">
        <first/><second/>
      </ErrorableGroup>
    );
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(1);
  });
});
