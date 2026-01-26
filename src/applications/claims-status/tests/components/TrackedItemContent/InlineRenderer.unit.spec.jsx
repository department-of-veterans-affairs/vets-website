import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { InlineRenderer } from '../../../components/TrackedItemContent/InlineRenderer';

describe('InlineRenderer', () => {
  it('should render string content', () => {
    const { container } = render(<InlineRenderer content="Plain text" />);
    expect(container.textContent).to.equal('Plain text');
  });

  it('should render array of strings', () => {
    const { container } = render(
      <InlineRenderer content={['Hello', ' ', 'World']} />,
    );
    expect(container.textContent).to.equal('Hello World');
  });

  it('should render mixed array with links', () => {
    const content = [
      'Visit ',
      {
        type: 'link',
        text: 'VA.gov',
        href: '/test',
        style: 'active',
      },
      ' for more info',
    ];
    const { container } = render(<InlineRenderer content={content} />);
    expect(container.textContent).to.include('Visit');
    expect(container.textContent).to.include('for more info');
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/test');
  });

  it('should render bold text', () => {
    const { container } = render(
      <InlineRenderer content={{ type: 'bold', content: 'Bold text' }} />,
    );
    const strong = container.querySelector('strong');
    expect(strong).to.exist;
    expect(strong.textContent).to.equal('Bold text');
  });

  it('should render italic text', () => {
    const { container } = render(
      <InlineRenderer content={{ type: 'italic', content: 'Italic text' }} />,
    );
    const em = container.querySelector('em');
    expect(em).to.exist;
    expect(em.textContent).to.equal('Italic text');
  });

  it('should render link', () => {
    const { container } = render(
      <InlineRenderer
        content={{
          type: 'link',
          text: 'Test Link',
          href: '/test',
          style: 'active',
        }}
      />,
    );
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/test');
  });

  it('should render telephone', () => {
    const { container } = render(
      <InlineRenderer content={{ type: 'telephone', contact: '8008271000' }} />,
    );
    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.exist;
    expect(telephone.getAttribute('contact')).to.equal('8008271000');
  });

  it('should render telephone with TTY', () => {
    const { container } = render(
      <InlineRenderer
        content={{ type: 'telephone', contact: '711', tty: true }}
      />,
    );
    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.exist;
    expect(telephone.getAttribute('tty')).to.equal('true');
  });

  it('should render line break', () => {
    const { container } = render(
      <InlineRenderer content={{ type: 'lineBreak' }} />,
    );
    const br = container.querySelector('br');
    expect(br).to.exist;
  });

  it('should handle nested content', () => {
    const { container } = render(
      <InlineRenderer
        content={{
          type: 'bold',
          content: ['This is ', { type: 'italic', content: 'bold italic' }],
        }}
      />,
    );
    const strong = container.querySelector('strong');
    const em = container.querySelector('em');
    expect(strong).to.exist;
    expect(em).to.exist;
  });

  it('should return null for invalid content', () => {
    const { container } = render(
      <InlineRenderer content={{ type: 'unknown' }} />,
    );
    expect(container.firstChild).to.be.null;
  });
});
