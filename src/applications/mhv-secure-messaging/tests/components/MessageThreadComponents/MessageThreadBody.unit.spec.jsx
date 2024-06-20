import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MessageThreadBody from '../../../components/MessageThread/MessageThreadBody';
import { messageId } from '../../fixtures/message-thread-with-full-body-response.json';

describe('Message Thread Body', () => {
  const url = 'https://vajira.max.gov/browse/MHV-41390';

  const formattedUrl = `${url} (opens in new tab)`;

  const text = `Hello, This is a test message to see how these urls ${url} are 
    displayed in message body when parsed from the text. Hopefully 
    they are showing up properly formatted when inside a paragraph or on 
    an individual line as below. ${url} Thank you! `;

  const formattedText = `Hello, This is a test message to see how these urls ${formattedUrl} are 
    displayed in message body when parsed from the text. Hopefully 
    they are showing up properly formatted when inside a paragraph or on 
    an individual line as below. ${formattedUrl} Thank you! `;

  it('renders properly', () => {
    const screen = render(<MessageThreadBody text={text} />);
    expect(
      screen.getByTestId(`message-body-${messageId}`).textContent,
    ).to.equal(formattedText);
    const links = screen.getAllByText(formattedUrl, { selector: 'a' });
    links.forEach(link => {
      expect(link.getAttribute('href')).to.equal(url);
      expect(link.getAttribute('target')).to.equal('_blank');
      expect(link.getAttribute('rel')).to.equal('noreferrer');
    });
  });
});
