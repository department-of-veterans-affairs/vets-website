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

  it('does not render HoldTimeInfo when holdTimeMessagingUpdate is false', () => {
    const { queryByText } = render(
      <VistaIntroText holdTimeMessagingUpdate={false} />,
    );
    expect(queryByText(/Your test results are available in your reports/)).to
      .not.exist;
  });

  it('does not render HoldTimeInfo when holdTimeMessagingUpdate is undefined', () => {
    const { queryByText } = render(<VistaIntroText />);
    expect(queryByText(/Your test results are available in your reports/)).to
      .not.exist;
  });

  it('renders HoldTimeInfo when holdTimeMessagingUpdate is true', () => {
    const { getByText } = render(<VistaIntroText holdTimeMessagingUpdate />);
    expect(getByText(/Your test results are available in your reports/)).to
      .exist;
  });

  it('renders va-additional-info when holdTimeMessagingUpdate is true', () => {
    const { container } = render(<VistaIntroText holdTimeMessagingUpdate />);
    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'What to know before reviewing your results',
    );
  });
});
