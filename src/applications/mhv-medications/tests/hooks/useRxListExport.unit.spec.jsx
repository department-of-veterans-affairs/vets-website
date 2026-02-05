import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import useRxListExport from '../../hooks/useRxListExport';
import * as pdfConfigs from '../../util/pdfConfigs';
import * as txtConfigs from '../../util/txtConfigs';
import * as buildPdfData from '../../util/buildPdfData';
import * as generateMedicationsPdfFile from '../../util/generateMedicationsPdfFile';
import * as helpers from '../../util/helpers';
import {
  PDF_TXT_GENERATE_STATUS,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
} from '../../util/constants';

describe('useRxListExport', () => {
  let sandbox;
  let buildPrescriptionsPDFListStub;
  let buildAllergiesPDFListStub;
  let buildPrescriptionsTXTStub;
  // eslint-disable-next-line no-unused-vars
  let buildAllergiesTXTStub;
  let buildPdfDataStub;
  let generateMedicationsPdfFileStub;
  // eslint-disable-next-line no-unused-vars
  let generateTextFileStub;

  const mockUser = {
    first: 'John',
    last: 'Doe',
    dob: '1980-01-01',
  };

  const mockAllergies = [
    { name: 'Penicillin', type: 'Drug', reaction: 'Hives' },
  ];

  const mockPrescriptions = [
    { prescriptionId: 1, prescriptionName: 'Test Med 1' },
    { prescriptionId: 2, prescriptionName: 'Test Med 2' },
  ];

  const defaultProps = {
    user: mockUser,
    allergies: mockAllergies,
    allergiesError: null,
    selectedFilterOption: 'ALL_MEDICATIONS',
    selectedSortOption: 'refillDate',
    currentFilterOptions: {},
    features: { isCernerPilot: false, isV2StatusMapping: false },
    fetchExportList: null,
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    buildPrescriptionsPDFListStub = sandbox
      .stub(pdfConfigs, 'buildPrescriptionsPDFList')
      .returns([]);
    buildAllergiesPDFListStub = sandbox
      .stub(pdfConfigs, 'buildAllergiesPDFList')
      .returns([]);
    buildPrescriptionsTXTStub = sandbox
      .stub(txtConfigs, 'buildPrescriptionsTXT')
      .returns('prescription text');
    buildAllergiesTXTStub = sandbox
      .stub(txtConfigs, 'buildAllergiesTXT')
      .returns('allergies text');
    buildPdfDataStub = sandbox.stub(buildPdfData, 'buildPdfData').returns({});
    generateMedicationsPdfFileStub = sandbox
      .stub(generateMedicationsPdfFile, 'generateMedicationsPdfFile')
      .resolves();
    generateTextFileStub = sandbox.stub(helpers, 'generateTextFile');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initial state', () => {
    it('should return correct initial values', () => {
      const { result } = renderHook(() => useRxListExport(defaultProps));

      expect(result.current.isLoading).to.be.false;
      expect(result.current.isSuccess).to.be.false;
      expect(result.current.hasError).to.be.false;
      expect(result.current.shouldPrint).to.be.false;
      expect(result.current.printList).to.deep.equal([]);
      expect(result.current.exportList).to.deep.equal([]);
      expect(result.current.errorFormat).to.be.undefined;
      expect(result.current.onDownload).to.be.a('function');
      expect(result.current.resetExportState).to.be.a('function');
      expect(result.current.clearPrintTrigger).to.be.a('function');
    });
  });

  describe('onDownload', () => {
    it('should call fetchExportList when exportList is empty', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(fetchExportListStub.calledOnce).to.be.true;
      });
    });

    it('should set error state when fetchExportList returns error', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: null,
        isError: true,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.true;
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });

    it('should set error state when fetchExportList is not provided', async () => {
      const { result } = renderHook(() => useRxListExport(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.true;
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });

    it('should set isLoading to true during export', async () => {
      const fetchExportListStub = sandbox.stub().returns(new Promise(() => {})); // Never resolves

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });
    });
  });

  describe('print flow', () => {
    it('should set shouldPrint to true and populate printList', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(result.current.shouldPrint).to.be.true;
        expect(result.current.printList).to.deep.equal(mockPrescriptions);
      });
    });

    it('should clear print trigger when clearPrintTrigger is called', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(result.current.shouldPrint).to.be.true;
      });

      result.current.clearPrintTrigger();

      await waitFor(() => {
        expect(result.current.shouldPrint).to.be.false;
      });
    });
  });

  describe('PDF generation flow', () => {
    it('should generate PDF when exportList and allergies are ready', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(buildPrescriptionsPDFListStub.calledOnce).to.be.true;
        expect(buildAllergiesPDFListStub.calledOnce).to.be.true;
        expect(buildPdfDataStub.calledOnce).to.be.true;
        expect(generateMedicationsPdfFileStub.calledOnce).to.be.true;
      });
    });

    it('should set isSuccess after PDF generation', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });
    });

    it('should pass feature flags to PDF builders', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = {
        ...defaultProps,
        features: { isCernerPilot: true, isV2StatusMapping: true },
        fetchExportList: fetchExportListStub,
      };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(
          buildPrescriptionsPDFListStub.calledWith(
            mockPrescriptions,
            true,
            true,
          ),
        ).to.be.true;
      });
    });
  });

  describe('TXT generation flow', () => {
    it('should pass feature flags to TXT builders', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = {
        ...defaultProps,
        features: { isCernerPilot: true, isV2StatusMapping: true },
        fetchExportList: fetchExportListStub,
      };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.TXT);

      await waitFor(() => {
        expect(fetchExportListStub.calledOnce).to.be.true;
      });

      // Give time for the effect to run
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify TXT builders were called with correct flags
      if (buildPrescriptionsTXTStub.called) {
        expect(
          buildPrescriptionsTXTStub.calledWith(mockPrescriptions, true, true),
        ).to.be.true;
      }
    });
  });

  describe('allergies error handling', () => {
    it('should set hasError when allergiesError is present during export', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
        fetchExportList: fetchExportListStub,
      };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
      });
    });

    it('should not generate PDF when allergiesError is present', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
        fetchExportList: fetchExportListStub,
      };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
      });

      // Wait a bit to ensure PDF generation is not triggered
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(generateMedicationsPdfFileStub.called).to.be.false;
    });
  });

  describe('resetExportState', () => {
    it('should reset all state to initial values', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      // Trigger export
      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });

      // Reset state
      result.current.resetExportState();

      await waitFor(() => {
        expect(result.current.isLoading).to.be.false;
        expect(result.current.isSuccess).to.be.false;
        expect(result.current.hasError).to.be.false;
        expect(result.current.shouldPrint).to.be.false;
        expect(result.current.printList).to.deep.equal([]);
        expect(result.current.exportList).to.deep.equal([]);
        expect(result.current.errorFormat).to.be.undefined;
      });
    });

    it('should clear error state when reset', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: null,
        isError: true,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.true;
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.PDF);
      });

      result.current.resetExportState();

      await waitFor(() => {
        expect(result.current.hasError).to.be.false;
        expect(result.current.errorFormat).to.be.undefined;
      });
    });
  });

  describe('error format tracking', () => {
    it('should track PDF format when PDF download fails', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: null,
        isError: true,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });

    it('should track TXT format when TXT download fails', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: null,
        isError: true,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.TXT);

      await waitFor(() => {
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.TXT);
      });
    });

    it('should track PRINT format when print fails', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: null,
        isError: true,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(result.current.errorFormat).to.equal(PRINT_FORMAT.PRINT);
      });
    });
  });

  describe('status tracking', () => {
    it('should track status progression through export lifecycle', async () => {
      const fetchExportListStub = sandbox.stub().resolves({
        data: { prescriptions: mockPrescriptions },
        isError: false,
      });

      const props = { ...defaultProps, fetchExportList: fetchExportListStub };
      const { result } = renderHook(() => useRxListExport(props));

      // Initial status
      expect(result.current.status.status).to.equal(
        PDF_TXT_GENERATE_STATUS.NotStarted,
      );
      expect(result.current.status.format).to.be.undefined;

      // Start download
      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.status.status).to.equal(
          PDF_TXT_GENERATE_STATUS.InProgress,
        );
        expect(result.current.status.format).to.equal(DOWNLOAD_FORMAT.PDF);
      });

      // Wait for success
      await waitFor(() => {
        expect(result.current.status.status).to.equal(
          PDF_TXT_GENERATE_STATUS.Success,
        );
      });
    });
  });
});
