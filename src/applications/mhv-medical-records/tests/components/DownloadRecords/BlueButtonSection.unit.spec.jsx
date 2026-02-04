import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import BlueButtonSection from '../../../components/DownloadRecords/BlueButtonSection';
import { ALERT_TYPE_BB_ERROR } from '../../../util/constants';
import reducer from '../../../reducers';

describe('BlueButtonSection', () => {
  const initialState = {
    featureToggles: {
      loading: false,
    },
    drupalStaticData: {
      vamcEhrData: {
        loading: false,
      },
    },
    user: {
      profile: {
        facilities: [],
      },
    },
  };

  const defaultProps = {
    activeAlert: null,
    failedBBDomains: [],
    getFailedDomainList: () => [],
    successfulBBDownload: false,
  };

  const renderComponent = (props = {}, state = {}) => {
    return renderWithStoreAndRouter(
      <BlueButtonSection {...defaultProps} {...props} />,
      {
        initialState: { ...initialState, ...state },
        reducers: reducer,
        path: '/download',
      },
    );
  };

  it('renders without errors', () => {
    const { getByText } = renderComponent();
    expect(getByText('Download your VA Blue Button report')).to.exist;
  });

  it('renders the Blue Button section heading', () => {
    const { getByText } = renderComponent();

    expect(getByText('Download your VA Blue Button report')).to.exist;
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_BB_ERROR', () => {
    const { getByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_BB_ERROR },
    });

    expect(getByTestId('expired-alert-message')).to.exist;
  });

  it('does not render error alert when activeAlert is null', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('expired-alert-message')).to.not.exist;
  });

  it('does not render error alert when activeAlert is different type', () => {
    const { queryByTestId } = renderComponent({
      activeAlert: { type: 'some-other-type' },
    });
    expect(queryByTestId('expired-alert-message')).to.not.exist;
  });

  it('renders Blue Button download link', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('go-to-download-all')).to.exist;
    expect(getByTestId('go-to-download-all')).to.have.attribute(
      'href',
      '/my-health/medical-records/download/date-range',
    );
  });

  it('renders Blue Button instructions text', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /First, select the types of records you want in your report. Then download./,
      ),
    ).to.exist;
  });

  it('renders DownloadSuccessAlert when successfulBBDownload is true', () => {
    const { getByTestId, getByText } = renderComponent({
      successfulBBDownload: true,
    });

    expect(getByTestId('alert-download-started')).to.exist;
    expect(getByText(/Your VA Blue Button report download has/)).to.exist;
  });

  it('does not render BB success alert when successfulBBDownload is false', () => {
    const { queryByText } = renderComponent({
      successfulBBDownload: false,
    });

    expect(queryByText(/Your VA Blue Button report download has/)).to.not.exist;
  });

  it('renders MissingRecordsError when successfulBBDownload is true and failedBBDomains exist', () => {
    const getFailedDomainList = () => ['allergies', 'medications'];
    const { getByText } = renderComponent({
      successfulBBDownload: true,
      failedBBDomains: ['allergies', 'medications'],
      getFailedDomainList,
    });

    expect(getByText(/Your VA Blue Button report download has/)).to.exist;
  });

  it('renders exactly one h2 heading', () => {
    const { container } = renderComponent();

    const h2s = container.querySelectorAll('h2');
    expect(h2s.length).to.equal(1);
    expect(h2s[0].textContent).to.equal('Download your VA Blue Button report');
  });
});
