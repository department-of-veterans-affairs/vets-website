import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import useExportFile from '../../hooks/useExportFile';
import {
  PDF_TXT_GENERATE_STATUS,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
} from '../../util/constants';

describe('useExportFile', () => {
  let sandbox;

  const mockAllergies = [
    { name: 'Penicillin', type: 'Drug', reaction: 'Hives' },
  ];

  const defaultProps = {
    allergies: mockAllergies,
    allergiesError: null,
    isReady: true,
    error: false,
    onGeneratePdf: sinon.stub().resolves(),
    onGenerateTxt: sinon.stub().resolves(),
    onBeforePrint: sinon.stub(),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initial state', () => {
    it('should return correct initial values', () => {
      const { result } = renderHook(() => useExportFile(defaultProps));

      expect(result.current.isLoading).to.be.false;
      expect(result.current.isSuccess).to.be.false;
      expect(result.current.hasError).to.be.false;
      expect(result.current.shouldPrint).to.be.false;
      expect(result.current.errorFormat).to.be.undefined;
      expect(result.current.onDownload).to.be.a('function');
      expect(result.current.clearPrintTrigger).to.be.a('function');
      expect(result.current.resetExportFlow).to.be.a('function');
    });

    it('should have NotStarted status initially', () => {
      const { result } = renderHook(() => useExportFile(defaultProps));

      expect(result.current.status.status).to.equal(
        PDF_TXT_GENERATE_STATUS.NotStarted,
      );
      expect(result.current.status.format).to.be.undefined;
    });
  });

  describe('onDownload', () => {
    it('should set status to InProgress when called', async () => {
      const { result } = renderHook(() => useExportFile(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.status.status).to.equal(
          PDF_TXT_GENERATE_STATUS.InProgress,
        );
        expect(result.current.status.format).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });

    it('should set isLoading to true during download', async () => {
      const props = {
        ...defaultProps,
        isReady: false,
        onGeneratePdf: () => new Promise(() => {}), // Never resolves
      };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });
    });
  });

  describe('PDF generation', () => {
    it('should call onGeneratePdf when format is PDF', async () => {
      const onGeneratePdf = sandbox.stub().resolves();
      const props = { ...defaultProps, onGeneratePdf };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(onGeneratePdf.calledOnce).to.be.true;
      });
    });

    it('should set isSuccess after PDF generation', async () => {
      const onGeneratePdf = sandbox.stub().resolves();
      const props = { ...defaultProps, onGeneratePdf };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });
    });

    it('should not generate PDF when allergies are not ready', async () => {
      const onGeneratePdf = sandbox.stub().resolves();
      const props = {
        ...defaultProps,
        allergies: null,
        onGeneratePdf,
      };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });

      // Wait a bit to ensure generation is not triggered
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(onGeneratePdf.called).to.be.false;
    });
  });

  describe('TXT generation', () => {
    it('should call onGenerateTxt when format is TXT', async () => {
      const onGenerateTxt = sandbox.stub().resolves();
      const props = { ...defaultProps, onGenerateTxt };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.TXT);

      await waitFor(() => {
        expect(onGenerateTxt.calledOnce).to.be.true;
      });
    });

    it('should set isSuccess after TXT generation', async () => {
      const onGenerateTxt = sandbox.stub().resolves();
      const props = { ...defaultProps, onGenerateTxt };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.TXT);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });
    });
  });

  describe('print flow', () => {
    it('should set shouldPrint to true when print is requested', async () => {
      const onBeforePrint = sandbox.stub();
      const props = { ...defaultProps, onBeforePrint };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(result.current.shouldPrint).to.be.true;
      });
    });

    it('should call onBeforePrint before setting shouldPrint', async () => {
      const onBeforePrint = sandbox.stub();
      const props = { ...defaultProps, onBeforePrint };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(onBeforePrint.calledOnce).to.be.true;
      });
    });

    it('should clear print trigger when clearPrintTrigger is called', async () => {
      const { result } = renderHook(() => useExportFile(defaultProps));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(result.current.shouldPrint).to.be.true;
      });

      result.current.clearPrintTrigger();

      await waitFor(() => {
        expect(result.current.shouldPrint).to.be.false;
      });
    });

    it('should not print when allergiesError is present', async () => {
      const onBeforePrint = sandbox.stub();
      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
        onBeforePrint,
      };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(PRINT_FORMAT.PRINT);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
      });

      expect(onBeforePrint.called).to.be.false;
      expect(result.current.shouldPrint).to.be.false;
    });
  });

  describe('error handling', () => {
    it('should set hasError when allergiesError is present during export', async () => {
      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
      };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
      });
    });

    it('should set errorFormat when allergiesError is present', async () => {
      const props = {
        ...defaultProps,
        allergiesError: new Error('Allergies API error'),
      };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.errorFormat).to.equal(DOWNLOAD_FORMAT.PDF);
      });
    });

    it('should set hasError when error prop is true', () => {
      const props = {
        ...defaultProps,
        error: true,
      };
      const { result } = renderHook(() => useExportFile(props));

      expect(result.current.hasError).to.be.ok;
    });

    it('should handle generation errors', async () => {
      const onGeneratePdf = sandbox
        .stub()
        .rejects(new Error('Generation failed'));
      const onGenerationError = sandbox.stub();
      const props = { ...defaultProps, onGeneratePdf, onGenerationError };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
        expect(onGenerationError.calledOnce).to.be.true;
      });
    });
  });

  describe('prepare step', () => {
    it('should call prepare function when provided', async () => {
      const prepare = sandbox.stub().resolves();
      const props = { ...defaultProps, prepare };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(prepare.calledOnce).to.be.true;
        expect(prepare.calledWith(DOWNLOAD_FORMAT.PDF)).to.be.true;
      });
    });

    it('should handle prepare errors as generation errors', async () => {
      const prepare = sandbox.stub().rejects(new Error('Prepare failed'));
      const onGenerationError = sandbox.stub();
      const props = { ...defaultProps, prepare, onGenerationError };
      const { result } = renderHook(() => useExportFile(props));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.hasError).to.be.ok;
      });
    });
  });

  describe('resetExportFlow', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useExportFile(defaultProps));

      result.current.onDownload(DOWNLOAD_FORMAT.PDF);

      await waitFor(() => {
        expect(result.current.isSuccess).to.be.true;
      });

      result.current.resetExportFlow();

      await waitFor(() => {
        expect(result.current.isLoading).to.be.false;
        expect(result.current.isSuccess).to.be.false;
        expect(result.current.hasError).to.be.false;
        expect(result.current.shouldPrint).to.be.false;
        expect(result.current.status.status).to.equal(
          PDF_TXT_GENERATE_STATUS.NotStarted,
        );
      });
    });
  });
});
