import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { TrackedItemContent } from '../../../components/TrackedItemContent';

describe('TrackedItemContent', () => {
  it('should render content with multiple blocks', () => {
    const content = [
      {
        type: 'paragraph',
        content: 'First paragraph',
      },
      {
        type: 'paragraph',
        content: 'Second paragraph',
      },
    ];
    const { container } = render(<TrackedItemContent content={content} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).to.have.length(2);
    expect(paragraphs[0].textContent).to.equal('First paragraph');
  });

  it('should render paragraph and list blocks', () => {
    const content = [
      {
        type: 'paragraph',
        content: 'Here is a list:',
      },
      {
        type: 'list',
        style: 'bullet',
        items: ['Item 1', 'Item 2'],
      },
    ];
    const { container } = render(<TrackedItemContent content={content} />);
    const p = container.querySelector('p');
    const ul = container.querySelector('ul');
    expect(p).to.exist;
    expect(ul).to.exist;
    const lis = container.querySelectorAll('li');
    expect(lis).to.have.length(2);
  });

  it('should render content with links', () => {
    const content = [
      {
        type: 'paragraph',
        content: [
          'Visit ',
          {
            type: 'link',
            text: 'VA Form 21-4142',
            href: '/find-forms/about-form-21-4142/',
            style: 'active',
          },
        ],
      },
    ];
    const { container } = render(<TrackedItemContent content={content} />);
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/find-forms/about-form-21-4142/',
    );
  });

  it('should render content with telephone numbers', () => {
    const content = [
      {
        type: 'paragraph',
        content: [
          'Call us at ',
          { type: 'telephone', contact: '8008271000' },
          ' or TTY ',
          { type: 'telephone', contact: '711', tty: true },
        ],
      },
    ];
    const { container } = render(<TrackedItemContent content={content} />);
    const telephones = container.querySelectorAll('va-telephone');
    expect(telephones).to.have.length(2);
    expect(telephones[0].getAttribute('contact')).to.equal('8008271000');
    expect(telephones[1].getAttribute('contact')).to.equal('711');
  });

  it('should render real-world content structure', () => {
    const content = [
      {
        type: 'paragraph',
        content:
          'For your benefits claim, we need your permission to request your personal information from a non-VA source, like a private doctor or hospital.',
      },
      {
        type: 'paragraph',
        content: 'Personal information may include:',
      },
      {
        type: 'list',
        style: 'bullet',
        items: [
          'Medical treatments',
          'Hospitalizations',
          'Psychotherapy',
          'Outpatient care',
        ],
      },
    ];
    const { container } = render(<TrackedItemContent content={content} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).to.have.length(2);
    const ul = container.querySelector('ul.bullet-disc');
    expect(ul).to.exist;
    const lis = container.querySelectorAll('li');
    expect(lis).to.have.length(4);
  });

  it('should return null for invalid content', () => {
    const { container } = render(<TrackedItemContent content={null} />);
    expect(container.firstChild).to.be.null;
  });
});
