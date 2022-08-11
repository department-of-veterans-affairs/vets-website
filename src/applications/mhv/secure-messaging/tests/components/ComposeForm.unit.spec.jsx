import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import ComposeForm from '../../components/ComposeForm';

describe('ComposeForm component', () => {
  it('should not be empty', () => {
    const tree = SkinDeep.shallowRender(<ComposeForm />);

    expect(tree.subTree('.compose-form')).not.to.be.empty;
  });

  it('should contain a message field', () => {
    const tree = SkinDeep.shallowRender(<ComposeForm />);

    expect(tree.subTree('.message-field').text()).to.contain('Message');
  });
});
