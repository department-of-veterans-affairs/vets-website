import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import PrefillMessage from '../../../../src/js/common/schemaform/save-in-progress/PrefillMessage';

describe('Schemaform <PrefillMessage>', () => {
  it('should render', () => {
    const prefillMessage = 'We’ve prefilled some of your information from your account. If you need to correct anything, you can edit the form fields below.';
    const tree = SkinDeep.shallowRender(
      <PrefillMessage message={prefillMessage}/>
    );

    expect(tree.text()).to.contain('prefilled some of your information');
  });
});
