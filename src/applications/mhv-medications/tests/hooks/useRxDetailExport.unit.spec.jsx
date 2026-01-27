/* eslint-disable react/prop-types */
import React from 'react';
import { expect } from 'chai';
import { waitFor, render } from '@testing-library/react';
import sinon from 'sinon';
import useRxDetailExport from '../../hooks/useRxDetailExport';
import * as pdfConfigs from '../../util/pdfConfigs';
import * as txtConfigs from '../../util/txtConfigs';
import * as generateRxDetailPdfFileModule from '../../util/generateRxDetailPdfFile';
import * as generateRxDetailTxtFileModule from '../../util/generateRxDetailTxtFile';
import { PDF_TXT_GENERATE_STATUS, DOWNLOAD_FORMAT } from '../../util/constants';

// Custom renderHook function
function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();
  result.current = null;

  function TestComponent({ renderCallbackProps }) {
    const hookResult = renderCallback(renderCallbackProps);
    result.current = hookResult;

    React.useEffect(() => {
      result.current = hookResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    <TestComponent renderCallbackProps={initialProps} />,
    renderOptions,
  );

  function rerender(rerenderCallbackProps) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />,
    );
  }

  return { result, rerender, unmount };
}

describe('useRxDetailExport', () => {
  let sandbox;
  let buildVAPrescriptionPDFListStub;
  let generateRxDetailPdfFileStub;
  let generateRxDetailTxtFileStub;

  const mockUser = {
    first: 'John',
    last: 'Doe',
    dob: '1980-01-01',
  };

  const mockAllergies = [
    { name: 'Penicillin', type: 'Drug', reaction: 'Hives' },
  ];

  const mockPrescription = {
    prescriptionId: 1,
    prescriptionName: 'Test Medication',
    prescriptionNumber: '12345',
  };

  const defaultProps = {
    user: mockUser,
    prescription: mockPrescription,
    allergies: mockAllergies,
    allergiesError: null,
    isNonVaPrescription: false,
    features: { isCernerPilot: false, isV2StatusMapping: false },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    buildVAPrescriptionPDFListStub = sandbox
      .stub(pdfConfigs, 'buildVAPrescriptionPDFList')
      .returns([]);
    sandbox.stub(pdfConfigs, 'buildAllergiesPDFList').returns([]);
    sandbox
      .stub(txtConfigs, 'buildVAPrescriptionTXT')
      .returns('prescription text');
    sandbox.stub(txtConfigs, 'buildAllergiesTXT').returns('allergies text');
    generateRxDetailPdfFileStub = sandbox
      .stub(generateRxDetailPdfFileModule, 'generateRxDetailPdfFile')
      .resolves();
    generateRxDetailTxtFileStub = sandbox.stub(
      generateRxDetailTxtFileModule,
      'generateRxDetailTxtFile',
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initial state', () => {
    it('should return correct initial values', () => {
      const { result } = renderHook(() => useRxDetailExport(defaultProps));

      expect(result.current.isLoading).to.be.false;
      expect(result.current.isSuccess).to.be.false;
      expect(result.current.hasError).to.be.false;
      expect(result.current.shouldPrint).to.be.false;
      expect(result.current.errorFormat).to.be.undefined;
      expect(result.current.onDownload).to.be.a('function');
    });

    it('should build prescription PDF list on init', () => {
      renderHook(() => useRxDetailExport(defaultProps));

      expect(buildVAPrescriptionPDFListStub.calledOnce).to.be.true;
      expect(
        buildVAPrescriptionPDFListStub.calledWith(
          mockPrescription,
          false,
          false,
        ),
      ).to.be.true;
    });
  });

  describe('onDownload', () => {
    it('should set status to InProgress when called', async () => {
      const { result } = renderHook(() => useRxDetailExport(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.status.status).to.equal(
          PDF_TXT_GENERATE_STATUS.InProgress,
        );
        expect(result.current.status.format).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });
  });

  describe('PDF generation', () => {
    it('should generate PDF when allergies are ready', async () => {
      const { result } = renderHook(() => useRxDetailExport(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(generateRxDetailPdfFileStub.calledOnce).to.be.true;
      });
    });

    it('should set isSuccess after PDF generation', async () => {
      const { result } = renderHook(() => useRxDetailExport(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });
    });
  });

  describe('TXT generation', () => {
    it('should generate TXT file when allergies are ready', async () => {
      const { result } = renderHook(() => useRxDetailExport(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.TXT);

      await waitFor(() => {
        expect(generateRxDetailTxtFileStub.calledOnce).to.be.true;
      });
    });

    it('should set isSuccess after TXT generation', async () => {
      const { result } = renderHook(() => useRxDetailExport(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.TXT);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });
    });
  });

  describe('error handling', () => {
    it('should set hasError when allergiesError is present during export', async () => {
      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
      };
      const { result } = renderHook(() => useRxDetailExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });

    it('should not generate PDF when allergiesError is present', async () => {
      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
      };
      const { result } = renderHook(() => useRxDetailExport(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
      });

      // Wait a bit to ensure PDF generation is not triggered
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(generateRxDetailPdfFileStub.called).to.be.false;
    });
  });

  describe('non-VA prescription', () => {
    it('should use non-VA PDF builder for non-VA prescriptions', () => {
      const buildNonVAPrescriptionPDFListStub = sandbox
        .stub(pdfConfigs, 'buildNonVAPrescriptionPDFList')
        .returns([]);

      const props = {
        ...defaultProps,
        isNonVaPrescription: true,
      };

      renderHook(() => useRxDetailExport(props));

      expect(buildNonVAPrescriptionPDFListStub.calledOnce).to.be.true;
    });
  });
});
