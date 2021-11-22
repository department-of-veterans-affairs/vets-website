import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import Back from '../../../../src/js/review/submit-states/Back';

describe('Schemaform review: <Back />', () => {
  const label = 'Back';
  const beforeText = '«';
  const buttonClass = 'usa-button-secondary';
  const onBack = _event => {
    // no-op
  };
  const button = SkinDeep.shallowRender(
    <Back onButtonClick={onBack} />,
  ).everySubTree('ProgressButton')[0];

  it('has an enabled back button', () => {
    expect(button.props.buttonText).to.equal(label);
    expect(button.props.disabled).to.be.undefined;
    expect(button.props.onButtonClick).to.equal(onBack);
    expect(button.props.beforeText).to.equal(beforeText);
    expect(button.props.buttonClass).to.equal(buttonClass);
  });
});
