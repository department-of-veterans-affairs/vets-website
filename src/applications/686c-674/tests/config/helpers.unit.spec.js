import { render } from '@testing-library/react';
import { expect } from 'chai';
import { generateTransition, generateTitle } from '../../config/helpers';

describe('generateTransition and generateTitle', () => {
  it('renders a transition element with the correct class and text', () => {
    const text = 'Transition text';
    const { container } = render(generateTransition(text));

    const pElement = container.querySelector('p');
    expect(pElement).to.not.be.null;
    expect(pElement.textContent).to.equal(text);
    expect(pElement.classList.contains('vads-u-margin-y--6')).to.be.true;
  });

  it('renders a transition element with a custom class if provided', () => {
    const text = 'Custom class text';
    const customClass = 'custom-class';
    const { container } = render(generateTransition(text, customClass));

    const pElement = container.querySelector('p');
    expect(pElement).to.not.be.null;
    expect(pElement.textContent).to.equal(text);
    expect(pElement.classList.contains(customClass)).to.be.true;
  });

  it('renders a title element with the correct class and text', () => {
    const text = 'Title text';
    const { container } = render(generateTitle(text));

    const h3Element = container.querySelector('h3');
    expect(h3Element).to.not.be.null;
    expect(h3Element.textContent).to.equal(text);
    expect(h3Element.classList.contains('vads-u-margin-top--0')).to.be.true;
    expect(h3Element.classList.contains('vads-u-color--base')).to.be.true;
  });
});
