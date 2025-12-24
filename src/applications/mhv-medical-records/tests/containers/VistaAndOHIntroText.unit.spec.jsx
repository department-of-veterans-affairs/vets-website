import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import VistaAndOHIntroText from '../../containers/ccdContent/VistaAndOHIntroText';

describe('VistaAndOHIntroText', () => {
  const defaultProps = {
    vistaFacilityNames: ['VA Western New York health care'],
    ohFacilityNames: ['VA Central Ohio health care'],
  };

  it('renders without crashing', () => {
    const { container } = render(<VistaAndOHIntroText {...defaultProps} />);
    expect(container).to.exist;
  });

  it('renders the correct h1 heading', () => {
    const { getByRole } = render(<VistaAndOHIntroText {...defaultProps} />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'Download your medical records reports',
    );
  });

  it('renders exactly one h1 element', () => {
    const { container } = render(<VistaAndOHIntroText {...defaultProps} />);
    const headings = container.querySelectorAll('h1');
    expect(headings.length).to.equal(1);
  });

  it('renders the Blue Button paragraph text', () => {
    const { getByText } = render(<VistaAndOHIntroText {...defaultProps} />);
    const paragraph = getByText(
      /You can download your VA medical records as a single report/,
    );
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include('VA Blue Button report');
    expect(paragraph.textContent).to.include('self-entered health information');
  });

  it('renders the CCD paragraph text', () => {
    const { getByText } = render(<VistaAndOHIntroText {...defaultProps} />);
    const paragraph = getByText(
      /VA medical records for these facilities aren’t available/,
    );
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include(
      'Download your Continuity of Care Document (CCD)',
    );
  });

  it('renders exactly two paragraph elements', () => {
    const { container } = render(<VistaAndOHIntroText {...defaultProps} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).to.equal(2);
  });

  it('renders VistA facility names in an unordered list', () => {
    const props = {
      vistaFacilityNames: [
        'VA Western New York health care',
        'VA Pacific Islands health care',
      ],
      ohFacilityNames: ['VA Central Ohio health care'],
    };
    const { container, getByText } = render(<VistaAndOHIntroText {...props} />);
    const lists = container.querySelectorAll('ul');
    expect(lists.length).to.equal(2);
    expect(getByText('VA Western New York health care')).to.exist;
    expect(getByText('VA Pacific Islands health care')).to.exist;
  });

  it('renders OH facility names in an unordered list', () => {
    const props = {
      vistaFacilityNames: ['VA Western New York health care'],
      ohFacilityNames: [
        'VA Central Ohio health care',
        'VA Portland health care',
      ],
    };
    const { container, getByText } = render(<VistaAndOHIntroText {...props} />);
    const lists = container.querySelectorAll('ul');
    expect(lists.length).to.equal(2);
    expect(getByText('VA Central Ohio health care')).to.exist;
    expect(getByText('VA Portland health care')).to.exist;
  });

  it('renders both VistA and OH facility lists with multiple facilities', () => {
    const props = {
      vistaFacilityNames: [
        'VA Western New York health care',
        'VA Pacific Islands health care',
      ],
      ohFacilityNames: [
        'VA Central Ohio health care',
        'VA Portland health care',
        'VA Roseburg health care',
      ],
    };
    const { container } = render(<VistaAndOHIntroText {...props} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).to.equal(5);
  });

  it('renders single facility in each list', () => {
    const { container, getByText } = render(
      <VistaAndOHIntroText {...defaultProps} />,
    );
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).to.equal(2);
    expect(getByText('VA Western New York health care')).to.exist;
    expect(getByText('VA Central Ohio health care')).to.exist;
  });

  it('does not render HoldTimeInfo when holdTimeMessagingUpdate is false', () => {
    const { queryByText } = render(
      <VistaAndOHIntroText {...defaultProps} holdTimeMessagingUpdate={false} />,
    );
    expect(queryByText(/Your test results are available in your reports/)).to
      .not.exist;
  });

  it('does not render HoldTimeInfo when holdTimeMessagingUpdate is undefined', () => {
    const { queryByText } = render(<VistaAndOHIntroText {...defaultProps} />);
    expect(queryByText(/Your test results are available in your reports/)).to
      .not.exist;
  });

  it('renders HoldTimeInfo when holdTimeMessagingUpdate is true', () => {
    const { getByText } = render(
      <VistaAndOHIntroText {...defaultProps} holdTimeMessagingUpdate />,
    );
    expect(getByText(/Your test results are available in your reports/)).to
      .exist;
  });

  it('renders va-additional-info when holdTimeMessagingUpdate is true', () => {
    const { container } = render(
      <VistaAndOHIntroText {...defaultProps} holdTimeMessagingUpdate />,
    );
    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'What to know before reviewing your results',
    );
  });
});
