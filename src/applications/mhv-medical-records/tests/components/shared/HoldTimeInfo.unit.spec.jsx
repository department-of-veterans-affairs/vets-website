import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import HoldTimeInfo from '../../../components/shared/HoldTimeInfo';

describe('HoldTimeInfo component', () => {
  it('renders with default locationPhrase "here"', () => {
    const { getByText } = render(<HoldTimeInfo />);
    // Use function matcher to handle text broken across whitespace
    expect(
      getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          content.includes('Your test results are available here')
        );
      }),
    ).to.exist;
  });

  it('renders with custom locationPhrase', () => {
    const { getByText } = render(
      <HoldTimeInfo locationPhrase="in your reports" />,
    );
    expect(
      getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          content.includes('Your test results are available in your reports')
        );
      }),
    ).to.exist;
  });

  it('renders the va-additional-info component with correct trigger', () => {
    const { container } = render(<HoldTimeInfo />);
    // va-additional-info is a web component, use closest to find it from inner content
    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'What to know before reviewing your results',
    );
  });

  it('renders the va-additional-info with no-print class', () => {
    const { container } = render(<HoldTimeInfo />);
    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo.getAttribute('class')).to.include('no-print');
  });

  it('renders content about giving care team time to review', () => {
    const { getByText } = render(<HoldTimeInfo />);
    expect(
      getByText(/Please give your care team some time to review your results/i),
    ).to.exist;
  });

  it('renders content about reviewing results on your own', () => {
    const { getByText } = render(<HoldTimeInfo />);
    expect(
      getByText(
        /If you do review results on your own, remember that many factors can/i,
      ),
    ).to.exist;
  });

  it('renders message about results being available before care team review', () => {
    const { getByText } = render(<HoldTimeInfo />);
    expect(
      getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          content.includes(
            'You may have access to your results before your care team reviews',
          )
        );
      }),
    ).to.exist;
  });
});
