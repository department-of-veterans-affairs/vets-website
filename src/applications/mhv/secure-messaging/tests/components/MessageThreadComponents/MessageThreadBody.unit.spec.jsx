import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MessageThreadBody from '../../../components/MessageThread/MessageThreadBody';

describe('Message Thread Body', () => {
  const url = 'https://vajira.max.gov/browse/MHV-41390';
  const text = `Hello, This is a test message to see how these urls ${url} are 
    displayed in message body when parsed from the text. Hopefully 
    they are showing up properly formatted when inside a paragraph or on 
    an individual line as below. ${url} Thank you! `;

  it('renders properly', () => {
    const screen = render(<MessageThreadBody text={text} />);
    expect(screen.getByTestId('message-body').textContent).to.equal(text);
    const links = screen.getAllByText(url, { selector: 'a' });
    links.forEach(link => {
      expect(link.getAttribute('href')).to.equal(url);
      expect(link.getAttribute('target')).to.equal('_blank');
      expect(link.getAttribute('rel')).to.equal('noreferrer');
    });
  });
});
