import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import OHOnlyIntroText from '../../containers/ccdContent/OHOnlyIntroText';

describe('OHOnlyIntroText', () => {
  it('renders without crashing', () => {
    const { container } = render(<OHOnlyIntroText />);
    expect(container).to.exist;
  });

  it('renders the correct h1 heading', () => {
    const { getByRole } = render(<OHOnlyIntroText />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'Download your medical records report',
    );
  });

  it('renders the description paragraph with CCD information', () => {
    const { getByText } = render(<OHOnlyIntroText />);
    const paragraph = getByText(/Download your Continuity of Care Document/);
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include('CCD');
    expect(paragraph.textContent).to.include(
      'a summary of your VA medical records',
    );
  });

  it('renders exactly one paragraph element', () => {
    const { container } = render(<OHOnlyIntroText />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).to.equal(1);
  });

  it('renders exactly one h1 element', () => {
    const { container } = render(<OHOnlyIntroText />);
    const headings = container.querySelectorAll('h1');
    expect(headings.length).to.equal(1);
  });
});
