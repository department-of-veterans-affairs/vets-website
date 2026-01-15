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

  it('does not render HoldTimeInfo when holdTimeMessagingUpdate is false', () => {
    const { queryByText } = render(
      <OHOnlyIntroText holdTimeMessagingUpdate={false} />,
    );
    expect(queryByText(/Your test results are available in your reports/)).to
      .not.exist;
  });

  it('does not render HoldTimeInfo when holdTimeMessagingUpdate is undefined', () => {
    const { queryByText } = render(<OHOnlyIntroText />);
    expect(queryByText(/Your test results are available in your reports/)).to
      .not.exist;
  });

  it('renders HoldTimeInfo when holdTimeMessagingUpdate is true', () => {
    const { getByText } = render(<OHOnlyIntroText holdTimeMessagingUpdate />);
    expect(getByText(/Your test results are available in your reports/)).to
      .exist;
  });
});
