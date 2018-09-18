import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import NewMessageForm from '../../components/forms/NewMessageForm';

const props = {
  message: {
    attachments: [],
    body: {},
    category: {},
    recipient: {},
    subject: {},
  },
  onAttachmentsClose: () => {},
  onSaveMessage: () => {},
  onSendMessage: () => {},
  toggleConfirmDelete: () => {},
};

describe('<NewMessageForm>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(
      <NewMessageForm {...props}/>
    );

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should have the expected id', () => {
    const tree = SkinDeep.shallowRender(
      <NewMessageForm {...props}/>
    );
    expect(tree.props.id).to.equal('msg-compose');
  });

  test('should not render recipients list if request fails', () => {
    const tree = SkinDeep.shallowRender(
      <NewMessageForm {...props}/>
    );
    expect(tree.subTree('MessageRecipient')).to.be.false;
  });

  test('should render recipients list when expected', () => {
    const tree = SkinDeep.shallowRender(
      <NewMessageForm {...props} recipients={['recipient 1']}/>
    );
    expect(tree.subTree('MessageRecipient')).to.be.ok;
  });
});
