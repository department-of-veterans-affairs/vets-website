import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { AboutThisTool } from '../../components/AboutThisTool';

describe('About this tool', () => {
  it('should render 2 anchor links and 1 va-link', () => {
    const { container } = render(<AboutThisTool />);

    expect(container.querySelectorAll('a').length).to.equal(2);

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;
    expect(vaLink.getAttribute('download')).to.not.equal(null);
    expect(vaLink.getAttribute('filetype')).to.equal('XLS');
    expect(vaLink.getAttribute('href')).to.equal(
      'https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx',
    );
    expect(vaLink.getAttribute('text')).to.equal(
      'Download data on all schools',
    );
  });

  it('should include the expected anchor ids', () => {
    const { container } = render(<AboutThisTool />);

    expect(container.querySelector('#about-this-tool')).to.exist;
    expect(container.querySelector('#gi-bill-comparison-tool-user-guide')).to
      .exist;
  });
});
