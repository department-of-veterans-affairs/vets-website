import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MissingRecordsWarningAlert from '../../../components/shared/MissingRecordsWarningAlert';

describe('MissingRecordsWarningAlert', () => {
  const TEST_ID = 'missing-records-warning-alert';

  it('renders the alert', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    expect(getByTestId(TEST_ID)).to.exist;
  });

  it('renders with warning status', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    expect(alert.getAttribute('status')).to.equal('warning');
  });

  it('renders the correct headline', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    const headline = alert.querySelector('[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent.trim()).to.equal(
      // Straight apostrophe in source; lint auto-fixes to curly for production
      "Some of your records aren't available in this report",
    );
  });

  it('renders the correct body text about VA Blue Button report', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    expect(alert.textContent).to.include(
      "Medical records from these VA health facilities aren't available in your VA Blue Button report:",
    );
  });

  it('renders the CCD guidance text', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    expect(alert.textContent).to.include('Continuity of Care Document (CCD)');
  });

  it('renders the CCD download link with #ccd fragment', () => {
    const { container } = render(<MissingRecordsWarningAlert />);
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/my-health/medical-records/download#ccd',
    );
    expect(link.getAttribute('text')).to.equal(
      'Go to download your Continuity of Care Document',
    );
  });

  it('has a unique id attribute distinct from DuplicateRecordsAlert', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    expect(alert.getAttribute('id')).to.equal('missing-records-warning-alert');
    expect(alert.getAttribute('id')).to.not.equal('duplicate-records-alert');
  });

  it('has the no-print class for print exclusion', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    expect(alert.getAttribute('class')).to.include('no-print');
  });

  it('has the correct Datadog action name', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId(TEST_ID);
    const actionName = alert.getAttribute('data-dd-action-name');
    expect(actionName).to.equal(
      "Some of your records aren't available in this report",
    );
  });

  describe('facility list rendering', () => {
    it('renders "None recorded" when no facility names are provided', () => {
      const { getByTestId } = render(<MissingRecordsWarningAlert />);
      const alert = getByTestId(TEST_ID);
      expect(alert.textContent).to.include('None recorded');
    });

    it('renders "None recorded" when an empty array is passed', () => {
      const { getByTestId } = render(
        <MissingRecordsWarningAlert ohFacilityNamesAfterCutover={[]} />,
      );
      const alert = getByTestId(TEST_ID);
      expect(alert.textContent).to.include('None recorded');
    });

    it('renders facility names as a list when string items are provided', () => {
      const facilities = ['Spokane VA Medical Center', 'Walla Walla VA'];
      const { getByText } = render(
        <MissingRecordsWarningAlert ohFacilityNamesAfterCutover={facilities} />,
      );
      expect(getByText('Spokane VA Medical Center')).to.exist;
      expect(getByText('Walla Walla VA')).to.exist;
    });

    it('renders facility names as a <ul> list', () => {
      const facilities = ['Facility A', 'Facility B'];
      const { container } = render(
        <MissingRecordsWarningAlert ohFacilityNamesAfterCutover={facilities} />,
      );
      const ul = container.querySelector('ul');
      expect(ul).to.exist;
      const items = ul.querySelectorAll('li');
      expect(items.length).to.equal(2);
    });

    it('renders facility names when object items with id and content are provided', () => {
      const facilities = [
        { id: '668-after', content: 'Spokane VA (October 24, 2022-present)' },
        {
          id: '757-after',
          content: 'Walla Walla VA (March 25, 2022-present)',
        },
      ];
      const { getByText } = render(
        <MissingRecordsWarningAlert ohFacilityNamesAfterCutover={facilities} />,
      );
      expect(getByText('Spokane VA (October 24, 2022-present)')).to.exist;
      expect(getByText('Walla Walla VA (March 25, 2022-present)')).to.exist;
    });

    it('renders a single facility name correctly', () => {
      const facilities = ['Single Facility'];
      const { getByText, container } = render(
        <MissingRecordsWarningAlert ohFacilityNamesAfterCutover={facilities} />,
      );
      expect(getByText('Single Facility')).to.exist;
      const items = container.querySelectorAll('li');
      expect(items.length).to.equal(1);
    });
  });
});
