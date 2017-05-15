import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import 'babel-polyfill';

import { makeField } from '../../../src/js/common/model/fields';
import { Settings } from '../../../src/js/rx/containers/Settings';

const props = {
  alert: {
    content: '',
    status: 'info',
    visible: false
  },
  email: makeField('test@vets.gov'),
  flag: makeField('false'),
  isLoading: false,
  isSaving: false
};

describe('<Settings>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Settings {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.be.ok;
  });

  it('should show a loading screen when getting preferences', () => {
    const tree = SkinDeep.shallowRender(
      <Settings {...props } isLoading/>
    );
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });

  it('should show a loading screen when saving preferences', () => {
    const tree = SkinDeep.shallowRender(
      <Settings {...props } isSaving/>
    );
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });

  it('should disable save button when nothing has changed', () => {
    const tree = SkinDeep.shallowRender(
      <Settings {...props }/>
    );
    const formButtons = tree.dive(['.rx-notifications-save']);
    const saveButton = formButtons.dive(['.usa-button-disabled']);
    expect(saveButton.text()).to.eql('Save changes');
    expect(formButtons.subTree('.usa-button-outline')).to.not.be.ok;
  });

  it('should enable save button and show cancel button if email is modified', () => {
    const tree = SkinDeep.shallowRender(
      <Settings
          {...props }
          email={makeField('new.test@vets.gov', true)}
          flag={makeField('false')}/>
    );
    const formButtons = tree.dive(['.rx-notifications-save']);
    const saveButton = formButtons.dive(['.usa-button']);
    const cancelButton = formButtons.dive(['.usa-button-outline']);
    expect(saveButton.text()).to.eql('Save changes');
    expect(saveButton.props.disabled).to.be.false;
    expect(cancelButton.text()).to.eql('Cancel');
  });

  it('should enable save button and show cancel button if flag is modified', () => {
    const tree = SkinDeep.shallowRender(
      <Settings
          {...props }
          email={makeField('test@vets.gov')}
          flag={makeField('on', true)}/>
    );
    const formButtons = tree.dive(['.rx-notifications-save']);
    const saveButton = formButtons.dive(['.usa-button']);
    const cancelButton = formButtons.dive(['.usa-button-outline']);
    expect(saveButton.text()).to.eql('Save changes');
    expect(saveButton.props.disabled).to.be.false;
    expect(cancelButton.text()).to.eql('Cancel');
  });
});
