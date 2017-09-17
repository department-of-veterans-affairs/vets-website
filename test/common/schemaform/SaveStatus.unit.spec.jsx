import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SaveStatus from '../../../src/js/common/schemaform/SaveStatus.jsx';
import { SAVE_STATUSES } from '../../../src/js/common/schemaform/save-load-actions';

describe('<SaveStatus>', () => {
  let props = {
    form: {
      formId: '1010ez',
    },
    profile: {
      savedForms: [
        {
          form: '1010ez',
          metadata: {
            last_updated: 1503688891,  // eslint-disable-line camelcase
            expires_at: 2504788891  // eslint-disable-line camelcase
          }
        }
      ]
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
    props.profile.savedForms = [];
    const tree = SkinDeep.shallowRender(<SaveStatus {...props}/>);
    expect(tree.everySubTree('.card information')).to.be.empty;
  });
});
