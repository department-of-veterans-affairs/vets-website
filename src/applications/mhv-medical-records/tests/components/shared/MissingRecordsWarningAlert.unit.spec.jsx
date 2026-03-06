import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MissingRecordsWarningAlert from '../../../components/shared/MissingRecordsWarningAlert';

describe('MissingRecordsWarningAlert', () => {
  it('renders the alert', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert).to.exist;
  });

  it('renders with warning status', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('status')).to.equal('warning');
  });

  it('renders the correct headline', () => {
    const { getByText } = render(<MissingRecordsWarningAlert />);
    expect(
      getByText(
        (_, element) =>
          element.textContent ===
          'Some of your records aren\u2019t available in this report',
      ),
    ).to.exist;
  });

  it('renders the correct body text about VA Blue Button report', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.textContent).to.include(
      'Medical records from these VA health facilities aren\u2019t available in your VA Blue Button report:',
    );
  });

  it('renders the CCD guidance text', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.textContent).to.include(
      'If you need medical records from these facilities, download your Continuity of Care Document (CCD).',
    );
  });

  it('renders the CCD download link', () => {
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

  it('has the correct id attribute', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('id')).to.equal('duplicate-records-alert');
  });

  it('has the no-print class for print exclusion', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('class')).to.include('no-print');
  });

  it('has the correct Datadog action name', () => {
    const { getByTestId } = render(<MissingRecordsWarningAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    const actionName = alert.getAttribute('data-dd-action-name');
    expect(actionName).to.include('available in this report');
    expect(actionName).to.include('Some of your records');
  });

  describe('facility list rendering', () => {
    it('renders "None recorded" when no facility names are provided', () => {
      const { getByTestId } = render(<MissingRecordsWarningAlert />);
      const alert = getByTestId('duplicate-records-info-alert');
      expect(alert.textContent).to.include('None recorded');
    });

    it('renders "None recorded" when an empty array is passed', () => {
      const { getByTestId } = render(
        <MissingRecordsWarningAlert ohFacilityNamesAfterCutover={[]} />,
      );
      const alert = getByTestId('duplicate-records-info-alert');
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
