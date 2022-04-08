import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import EmailWidget from '../../../src/js/widgets/EmailWidget';

describe('Schemaform <EmailWidget>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<EmailWidget />);
    const { props } = tree.subTree('TextWidget');
    expect(props.type).to.equal('email');
    expect(props.autocomplete).to.equal('email');
  });
});
