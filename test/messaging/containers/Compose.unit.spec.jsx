import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { makeField } from '../../../src/js/common/model/fields';
import { Compose } from '../../../src/js/messaging/containers/Compose';

const props = {
  message: {
    attachments: [],
    body: makeField(''),
    category: makeField(''),
    recipient: makeField(''),
    subject: makeField('')
  },
  recipients: [],
  deleteConfirmModal: {
    visible: false
  },

  // No-op function to override dispatch
  setMessageField: () => {},
  dispatch: () => {}
};

describe('Compose', () => {
  const tree = SkinDeep.shallowRender(<Compose {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
