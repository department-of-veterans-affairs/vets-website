import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { BlockRenderer } from '../../../components/TrackedItemContent/BlockRenderer';

describe('BlockRenderer', () => {
  it('should render paragraph with text content', () => {
    const { container } = render(
      <BlockRenderer
        block={{ type: 'paragraph', content: 'Simple paragraph text' }}
      />,
    );
    const p = container.querySelector('p');
    expect(p).to.exist;
    expect(p.textContent).to.equal('Simple paragraph text');
  });

  it('should render paragraph with inline elements', () => {
    const { container } = render(
      <BlockRenderer
        block={{
          type: 'paragraph',
          content: [
            'Visit ',
            {
              type: 'link',
              text: 'VA.gov',
              href: '/test',
              style: 'active',
            },
          ],
        }}
      />,
    );
    const p = container.querySelector('p');
    expect(p).to.exist;
    expect(p.textContent).to.include('Visit');
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/test');
  });

  it('should render bullet list', () => {
    const { container } = render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: ['Item 1', 'Item 2', 'Item 3'],
        }}
      />,
    );
    const ul = container.querySelector('ul');
    expect(ul).to.exist;
    expect(ul.className).to.equal('bullet-disc');
    const lis = container.querySelectorAll('li');
    expect(lis).to.have.length(3);
    expect(lis[0].textContent).to.equal('Item 1');
  });

  it('should render numbered list', () => {
    const { container } = render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'numbered',
          items: ['First', 'Second', 'Third'],
        }}
      />,
    );
    const ol = container.querySelector('ol');
    expect(ol).to.exist;
    expect(ol.hasAttribute('class')).to.be.false;
    const lis = container.querySelectorAll('li');
    expect(lis).to.have.length(3);
  });

  it('should render list with inline elements in items', () => {
    const { container } = render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
          items: [
            'Simple item',
            ['Item with ', { type: 'bold', content: 'bold text' }],
            {
              type: 'link',
              text: 'Link item',
              href: '/test',
              style: 'active',
            },
          ],
        }}
      />,
    );
    const ul = container.querySelector('ul');
    expect(ul).to.exist;
    const lis = container.querySelectorAll('li');
    expect(lis).to.have.length(3);
    expect(lis[0].textContent).to.equal('Simple item');
    expect(lis[1].textContent).to.include('bold text');
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/test');
    expect(lis[2].contains(link)).to.be.true;
  });

  it('should render line break', () => {
    const { container } = render(
      <BlockRenderer block={{ type: 'lineBreak' }} />,
    );
    const br = container.querySelector('br');
    expect(br).to.exist;
  });

  it('should return null for invalid block', () => {
    const { container } = render(<BlockRenderer block={{ type: 'unknown' }} />);
    expect(container.firstChild).to.be.null;
  });

  it('should handle list without items', () => {
    const { container } = render(
      <BlockRenderer
        block={{
          type: 'list',
          style: 'bullet',
        }}
      />,
    );
    const ul = container.querySelector('ul');
    expect(ul).to.exist;
    const lis = container.querySelectorAll('li');
    expect(lis).to.have.length(0);
  });
});
