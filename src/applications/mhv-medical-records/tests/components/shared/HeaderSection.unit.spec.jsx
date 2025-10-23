import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import HeaderSection from '../../../components/shared/HeaderSection';

describe('HeaderSection', () => {
  it('renders with the correct header level', () => {
    const { container } = render(<HeaderSection header="Test Header" />);
    const headerTag = container.querySelector('h1');
    expect(headerTag).to.not.be.null;
    expect(headerTag.textContent).to.equal('Test Header');
  });

  it('renders children inside the container', () => {
    const { getByText } = render(
      <HeaderSection header="Test Header">
        <div>Child Content</div>
      </HeaderSection>,
    );
    expect(getByText('Child Content')).to.not.be.null;
  });

  it('renders nested headers with correct levels', () => {
    const { container } = render(
      <HeaderSection header="Level 1">
        <HeaderSection header="Level 2">
          <HeaderSection header="Level 3" />
        </HeaderSection>
      </HeaderSection>,
    );
    const level1 = container.querySelector('h1');
    const level2 = container.querySelector('h2');
    const level3 = container.querySelector('h3');

    expect(level1).to.not.be.null;
    expect(level1.textContent).to.equal('Level 1');

    expect(level2).to.not.be.null;
    expect(level2.textContent).to.equal('Level 2');

    expect(level3).to.not.be.null;
    expect(level3.textContent).to.equal('Level 3');
  });
});
