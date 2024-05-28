import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import {
  attachmentMiddleware,
  VhcButtonAttachment,
  extractContent,
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
      'application/vnd.microsoft.botframework.samples.vhc-form-button',
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

  it.only('should extract the URL from the input', () => {
    const input =
      'The input from PVA is: {   "type": "message",   "attachments": [     {       "content": {         "action": "https://app.hermes.cirrusmd.com/va/jwt/auth?plan_uuid=b6a7375d-f442-43f4-b65b-f20086155f3b",         "jwt": "jwt goes here",         "title": "Open VA Health Chat"       },       "contentType": "application/vnd.microsoft.botframework.samples.vhc-form-button"     }   ] }. Now exiting the skill.';
    const expectedUrl =
      'https://app.hermes.cirrusmd.com/va/jwt/auth?plan_uuid=b6a7375d-f442-43f4-b65b-f20086155f3b';

    const result = extractContent(input);

    expect(result.action).to.equal(expectedUrl);
    expect(result.jwt).to.equal('jwt goes here');
    expect(result.title).to.equal('Open VA Health Chat');
  });
});
