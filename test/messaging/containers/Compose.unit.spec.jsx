import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { makeField } from '../../../src/js/common/model/fields';
import { composeMessage } from '../../../src/js/messaging/config';
import { Compose } from '../../../src/js/messaging/containers/Compose';

const props = {
  message: {
    sender: {
      firstName: '',
      lastName: '',
      middleName: ''
    },
    category: makeField(''),
    recipient: makeField(''),
    subject: makeField(''),
    text: makeField(''),
    charsRemaining: composeMessage.maxChars.message,
    attachments: []
  },
  recipients: [],
  deleteConfirmModal: {
    visible: false
  },

  // No-op function to override dispatch
  dispatch: () => {}
};

describe('Compose', () => {
  const tree = SkinDeep.shallowRender(<Compose {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
