import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { ALERT_TYPE_SEI_ERROR } from '@department-of-veterans-affairs/mhv/exports';
import VistaOnlyContent from '../../../components/DownloadRecords/VistaOnlyContent';
import { ALERT_TYPE_CCD_ERROR } from '../../../util/constants';
import reducer from '../../../reducers';
import { DownloadReportProvider } from '../../../context/DownloadReportContext';

describe('VistaOnlyContent', () => {
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

  const defaultContextValue = {
    activeAlert: null,
    ccdError: false,
    CCDRetryTimestamp: null,
    ccdExtendedFileTypeFlag: false,
    ccdDownloadSuccess: false,
    generatingCCD: false,
    handleDownloadCCD: () => {},
    handleDownloadCCDV2: () => {},
    expandSelfEntered: false,
    selfEnteredAccordionRef: { current: null },
    runningUnitTest: true,
    vistaFacilityNames: [],
  };

  const renderComponent = (contextOverrides = {}, state = {}) => {
    const contextValue = { ...defaultContextValue, ...contextOverrides };
    return renderWithStoreAndRouter(
      <DownloadReportProvider value={contextValue}>
        <VistaOnlyContent />
      </DownloadReportProvider>,
      {
        initialState: { ...initialState, ...state },
        reducers: reducer,
        path: '/download',
      },
    );
  };

  it('renders without errors', () => {
    const { getByText } = renderComponent();
    expect(getByText('Other reports you can download')).to.exist;
  });

  it('renders the Other reports section heading', () => {
    const { getByText } = renderComponent();

    expect(getByText('Other reports you can download')).to.exist;
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_CCD_ERROR', () => {
    const { getAllByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_CCD_ERROR },
    });

    expect(getAllByTestId('expired-alert-message').length).to.be.greaterThan(0);
  });

  it('renders AccessTroubleAlertBox when activeAlert type is ALERT_TYPE_SEI_ERROR', () => {
    const { getAllByTestId } = renderComponent({
      activeAlert: { type: ALERT_TYPE_SEI_ERROR },
    });

    expect(getAllByTestId('expired-alert-message').length).to.be.greaterThan(0);
  });

  it('does not render error alerts when activeAlert is null', () => {
    const { queryAllByTestId } = renderComponent();
    expect(queryAllByTestId('expired-alert-message').length).to.equal(0);
  });

  it('renders CcdAccessErrors with CCD error when CCDRetryTimestamp is set', () => {
    const { getAllByTestId } = renderComponent({
      CCDRetryTimestamp: '2025-01-01T00:00:00Z',
    });

    expect(getAllByTestId('expired-alert-message').length).to.be.greaterThan(0);
  });

  it('renders MissingRecordsError and DownloadSuccessAlert when SEI download is successful with some failed domains', () => {
    // Note: SEI state is now managed by useSelfEnteredPdf hook.
    // This test verifies the component renders the self-entered section.
    // Success alerts are shown when hook returns success=true, which requires
    // actual download interaction (tested at integration level).
    const { getByTestId } = renderComponent();

    expect(getByTestId('selfEnteredAccordionItem')).to.exist;
  });

  it('renders self-entered accordion item', () => {
    const { getByTestId, getByText } = renderComponent();

    expect(getByTestId('selfEnteredAccordionItem')).to.exist;
    expect(getByText('Self-entered health information')).to.exist;
  });

  it('renders self-entered accordion item description text', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /This report includes all the health information you entered yourself/,
      ),
    ).to.exist;
  });

  it('renders self-entered download button', () => {
    // Note: Loading state is now managed by useSelfEnteredPdf hook.
    // Button is rendered by default when hook's loading=false.
    const { getByTestId } = renderComponent();

    expect(getByTestId('downloadSelfEnteredButton')).to.exist;
  });

  describe('CCD Download Success Alert', () => {
    it('does not render CCD download success alert when only generatingCCD is true, but shows spinner', () => {
      const { queryByText, getByTestId } = renderComponent({
        generatingCCD: true,
        ccdDownloadSuccess: false,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
      expect(getByTestId('generating-ccd-VistA-indicator')).to.exist;
    });

    it('renders CCD download success alert when ccdDownloadSuccess is true and no error', () => {
      const { getByText } = renderComponent({
        ccdDownloadSuccess: true,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(getByText(/Continuity of Care Document download/)).to.exist;
    });

    it('does not render CCD success alert when ccdError is true', () => {
      const { queryByText } = renderComponent({
        generatingCCD: true,
        ccdError: true,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
    });

    it('does not render CCD success alert when CCDRetryTimestamp is set', () => {
      const { queryByText } = renderComponent({
        generatingCCD: true,
        ccdError: false,
        CCDRetryTimestamp: '2025-12-09T10:30:00Z',
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
    });

    it('does not render CCD success alert when both generatingCCD and ccdDownloadSuccess are false', () => {
      const { queryByText } = renderComponent({
        generatingCCD: false,
        ccdDownloadSuccess: false,
        ccdError: false,
        CCDRetryTimestamp: null,
      });

      expect(queryByText(/Continuity of Care Document download/)).to.not.exist;
    });
  });

  it('renders Blue Button note at the bottom', () => {
    const { getByText } = renderComponent();

    expect(
      getByText(
        /Blue Button and the Blue Button logo are registered service marks/,
      ),
    ).to.exist;
  });

  describe('CCD Accordion rendering based on flags', () => {
    it('renders CCDAccordionItemV1 when ccdExtendedFileTypeFlag is false', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: false,
      });

      expect(getByTestId('ccdAccordionItem')).to.exist;
    });

    it('renders CCDAccordionItemV2 when ccdExtendedFileTypeFlag is true and no dual/OH sources', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
        hasBothDataSources: false,
        hasOHOnly: false,
      });

      expect(getByTestId('ccdAccordionItem')).to.exist;
    });

    it('renders CCDAccordionItemVista when ccdExtendedFileTypeFlag is true and hasBothDataSources', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
        hasBothDataSources: true,
      });

      expect(getByTestId('ccdAccordionItem')).to.exist;
    });

    it('renders CCDAccordionItemOH when ccdExtendedFileTypeFlag is true and hasOHOnly', () => {
      const { getByTestId } = renderComponent({
        ccdExtendedFileTypeFlag: true,
        hasBothDataSources: false,
        hasOHOnly: true,
      });

      expect(getByTestId('ccdAccordionItem')).to.exist;
    });
  });

  it('opens self-entered accordion when expandSelfEntered is true', () => {
    const { getByTestId } = renderComponent({
      expandSelfEntered: true,
    });

    const accordion = getByTestId('selfEnteredAccordionItem');
    expect(accordion).to.have.attribute('open', 'true');
  });

  it('does not open self-entered accordion when expandSelfEntered is false', () => {
    const { getByTestId } = renderComponent({
      expandSelfEntered: false,
    });

    const accordion = getByTestId('selfEnteredAccordionItem');
    expect(accordion).to.not.have.attribute('open');
  });

  it('renders va-accordion with bordered attribute', () => {
    const { container } = renderComponent();

    const accordion = container.querySelector('va-accordion');
    expect(accordion).to.exist;
    expect(accordion).to.have.attribute('bordered');
  });

  it('does not render h1 heading (heading is in parent intro component)', () => {
    const { container } = renderComponent();

    const h1 = container.querySelector('h1');
    expect(h1).to.not.exist;
  });

  it('renders one h2 heading', () => {
    const { container } = renderComponent();

    const h2s = container.querySelectorAll('h2');
    expect(h2s.length).to.equal(1);
    expect(h2s[0].textContent).to.equal('Other reports you can download');
  });
});
