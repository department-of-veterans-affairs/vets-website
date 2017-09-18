import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SaveStatus from '../../../src/js/common/schemaform/SaveStatus.jsx';
import { SAVE_STATUSES } from '../../../src/js/common/schemaform/save-load-actions';

describe('<SaveStatus>', () => {
  const props = {
    form: {
      formId: '1010ez',
      lastSavedDate: 1505770055
    }
  };
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<SaveStatus {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
  it('should show last saved date', () => {
    const tree = SkinDeep.shallowRender(<SaveStatus {...props}/>);
    expect(tree.text()).to.have.string('Application has been saved.');
  });
  it('should show saving', () => {
    props.form.savedStatus = SAVE_STATUSES.autoPending;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props}/>);
    expect(tree.text()).to.have.string('Saving...');
  });
  it('should not show a status for an unsaved form', () => {
    props.form.savedStatus = undefined;
    props.form.lastSavedDate = undefined;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props}/>);
    expect(tree.text()).to.not.have.string('Application has been saved.');
    expect(tree.text()).to.not.have.string('Saving...');
  });
});
