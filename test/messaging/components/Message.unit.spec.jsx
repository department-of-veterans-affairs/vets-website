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

  it('should show details when expanded', () => {
    const tree = SkinDeep.shallowRender(<Message {...props}/>);
    expect(tree.props.className).to.contain('messaging-thread-message--expanded');
    expect(tree.subTree('MessageDetails')).to.be.ok;
  });

  it('should show attachments when expanded', () => {
    const tree = SkinDeep.shallowRender(
      <Message {...props} attrs={{ ...props.attrs, attachment: true }}/>
    );
    expect(tree.props.className).to.contain('messaging-thread-message--expanded');
    expect(tree.subTree('MessageAttachmentsView')).to.be.ok;
  });

  it('should hide details when collapsed', () => {
    const tree = SkinDeep.shallowRender(<Message {...props} isCollapsed/>);
    expect(tree.props.className).to.contain('messaging-thread-message--collapsed');
    expect(tree.subTree('MessageDetails')).to.be.false;
  });

  it('should hide attachments when collapsed', () => {
    const tree = SkinDeep.shallowRender(
      <Message
          {...props}
          attrs={{ ...props.attrs, attachment: true }}
          isCollapsed/>
    );
    expect(tree.props.className).to.contain('messaging-thread-message--collapsed');
    expect(tree.subTree('MessageAttachmentsView')).to.be.false;
  });

  it('should display as a draft when there is no sent date', () => {
    const tree = SkinDeep.shallowRender(
      <Message {...props} attrs={{ ...props.attrs, sentDate: null }}/>
    );
    expect(tree.props.className).to.contain('messaging-thread-message--draft');
    expect(tree.subTree('.messaging-message-sent-date').text()).to.be.empty;
  });
});
