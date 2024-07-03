import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import {
  attachmentMiddleware,
  VhcButtonAttachment,
} from '../../middleware/attachmentMiddleware';

function generateFakeCard(contentType, content) {
  return {
    attachment: {
      contentType,
      content,
    },
  };
}

describe('attachmentMiddleware', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render VhcButtonAttachment component for vhc-form-button content type', () => {
    const card = generateFakeCard(
      'application/vnd.va_chatbot.card.formPostButton',
      {
        action: 'some-action',
        jwt: 'some-jwt',
        title: 'Button Title',
      },
    );
    const nextSpy = sinon.spy();
    const result = attachmentMiddleware()(nextSpy)(card);
    expect(nextSpy.calledOnce).to.be.false;
    expect(result).to.deep.equal(
      <VhcButtonAttachment
        action={card.attachment.content.action}
        jwt={card.attachment.content.jwt}
        title={card.attachment.content.title}
      />,
    );
  });
  it('should call next middleware for other content types', () => {
    const card = generateFakeCard('other-content-type', {
      action: 'some-action',
      jwt: 'some-jwt',
      title: 'Button Title',
    });

    const nextSpy = sinon.spy();
    attachmentMiddleware()(nextSpy)(card);
    expect(nextSpy.calledWithExactly(card)).to.be.true;
  });
});
