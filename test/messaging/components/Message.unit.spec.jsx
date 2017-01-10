import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Message from '../../../src/js/messaging/components/Message';

const props = {
  attrs: {
    messageId: 123,
    category: 'APPOINTMENTS',
    subject: 'Scheduling An Appointment',
    body: 'Testing 123.',
    attachment: false,
    sentDate: "2016-12-21T05:54:26.000Z",
    senderId: 456,
    senderName: 'Clinician',
    recipientId: 789,
    recipientName: 'Veteran',
    readReceipt: 'READ'
  },
  fetchMessage: () => {},
  isCollapsed: false,
  onToggleCollapsed: () => {}
};

describe('Message', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Message {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should show details and attachments when expanded', () => {
    const tree = SkinDeep.shallowRender(<Message {...props}/>);
    expect(tree.props.className).to.contain('messaging-thread-message--expanded');
    expect(tree.subTree('MessageDetails')).to.exist;
    expect(tree.subTree('MessageAttachmentsView')).to.exist;
  });

  it('should hide details and attachments when collapsed', () => {
    const tree = SkinDeep.shallowRender(<Message {...props} isCollapsed/>);
    expect(tree.props.className).to.contain('messaging-thread-message--collapsed');
    expect(tree.subTree('MessageDetails')).to.be.false;
    expect(tree.subTree('MessageAttachmentsView')).to.be.false;
  });
});
