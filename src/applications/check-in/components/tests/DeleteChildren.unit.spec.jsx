import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DeleteChildren from '../DeleteChildren';

describe('DeleteChildren', () => {
  it('renders children without strikethrough when isDeleted is false', () => {
    const { container } = render(
      <DeleteChildren isDeleted={false}>
        <span>Example Text</span>
      </DeleteChildren>,
    );
    const delElement = container.querySelector('del');
    expect(delElement).to.not.exist;
    expect(container.textContent).to.equal('Example Text');
  });

  it('renders children with strikethrough when isDeleted is true', () => {
    const { container } = render(
      <DeleteChildren isDeleted>
        <span>Example Text</span>
      </DeleteChildren>,
    );
    const delElement = container.querySelector('del');
    expect(delElement).to.exist;
    expect(delElement.textContent).to.equal('Example Text');
  });
});
