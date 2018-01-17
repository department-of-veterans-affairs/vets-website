import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ErrorableFileInput from '../../../../src/js/common/components/form-elements/ErrorableFileInput';

describe('<ErrorableFileInput>', () => {
  it('no error styles when errorMessage undefined', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableFileInput buttonText="my label" onChange={(_update) => {}}/>
    );

    // No error classes.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-message')).to.have.lengthOf(0);
  });

  it('has error styles when errorMessage is set', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableFileInput buttonText="my label" errorMessage="error message" onChange={(_update) => {}}/>
    );

    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Error error message');
  });

  it('onChange fires and clears input', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ErrorableFileInput buttonText="my label" onChange={onChange}/>
    );

    const event = {
      target: {
        files: [{}],
        value: 'asdfasdf'
      }
    };

    tree.getMountedInstance().handleChange(event);

    expect(onChange.called).to.be.true;
    expect(event.target.value).to.be.null;
  });
});
