import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import VistaIntroText from '../../containers/ccdContent/VistaIntroText';

describe('VistaIntroText', () => {
  it('renders without crashing', () => {
    const { container } = render(<VistaIntroText />);
    expect(container).to.exist;
  });

  it('renders the correct h1 heading', () => {
    const { getByRole } = render(<VistaIntroText />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'Download your medical records reports',
    );
  });

  it('renders the description paragraph with Blue Button information', () => {
    const { getByText } = render(<VistaIntroText />);
    const paragraph = getByText(
      /Download your VA medical records as a single report/,
    );
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include('VA Blue Button®');
    expect(paragraph.textContent).to.include(
      'Or find other reports to download',
    );
  });

  it('renders exactly one paragraph element', () => {
    const { container } = render(<VistaIntroText />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).to.equal(1);
  });

  it('renders exactly one h1 element', () => {
    const { container } = render(<VistaIntroText />);
    const headings = container.querySelectorAll('h1');
    expect(headings.length).to.equal(1);
  });
});
