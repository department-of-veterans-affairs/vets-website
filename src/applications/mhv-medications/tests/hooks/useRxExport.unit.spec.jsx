import { renderHook, act } from '@testing-library/react-hooks';
import { expect } from 'chai';
import {
  useRxExport,
  EXPORT_STATUS,
  EXPORT_FORMAT,
} from '../../hooks/useRxExport';

describe('useRxExport hook', () => {
  const defaultProps = {
    userName: { first: 'John', last: 'Doe' },
    dob: '1990-01-15',
    allergies: [{ name: 'Penicillin' }],
    allergiesError: null,
    options: { isCernerPilot: false, isV2StatusMapping: false },
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      expect(result.current.exportStatus.status).to.equal(
        EXPORT_STATUS.NotStarted,
      );
      expect(result.current.exportStatus.format).to.be.undefined;
      expect(result.current.isExportInProgress).to.be.false;
      expect(result.current.isExportSuccess).to.be.false;
      expect(result.current.isShowingError).to.be.false;
      expect(result.current.hasExportError).to.be.false;
    });

    it('should provide export methods', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      expect(result.current.startExport).to.be.a('function');
      expect(result.current.resetExportStatus).to.be.a('function');
      expect(result.current.setExportSuccess).to.be.a('function');
      expect(result.current.setExportError).to.be.a('function');
      expect(result.current.exportRxDetails).to.be.an('object');
      expect(result.current.exportRxDetails.pdf).to.be.a('function');
      expect(result.current.exportRxDetails.txt).to.be.a('function');
      expect(result.current.exportRxList).to.be.an('object');
      expect(result.current.exportRxList.pdf).to.be.a('function');
      expect(result.current.exportRxList.txt).to.be.a('function');
    });
  });

  describe('startExport', () => {
    it('should set export status to in progress with format', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      act(() => {
        result.current.startExport(EXPORT_FORMAT.PDF);
      });

      expect(result.current.exportStatus.status).to.equal(
        EXPORT_STATUS.InProgress,
      );
      expect(result.current.exportStatus.format).to.equal(EXPORT_FORMAT.PDF);
      expect(result.current.isExportInProgress).to.be.true;
    });

    it('should clear previous errors when starting export', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      act(() => {
        result.current.setExportError(true);
      });

      expect(result.current.hasExportError).to.be.true;

      act(() => {
        result.current.startExport(EXPORT_FORMAT.TXT);
      });

      expect(result.current.hasExportError).to.be.false;
    });
  });

  describe('resetExportStatus', () => {
    it('should reset export status to not started', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      act(() => {
        result.current.startExport(EXPORT_FORMAT.PDF);
      });

      expect(result.current.isExportInProgress).to.be.true;

      act(() => {
        result.current.resetExportStatus();
      });

      expect(result.current.exportStatus.status).to.equal(
        EXPORT_STATUS.NotStarted,
      );
      expect(result.current.exportStatus.format).to.be.undefined;
      expect(result.current.isExportInProgress).to.be.false;
    });
  });

  describe('setExportSuccess', () => {
    it('should set export status to success', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      act(() => {
        result.current.setExportSuccess();
      });

      expect(result.current.exportStatus.status).to.equal(
        EXPORT_STATUS.Success,
      );
      expect(result.current.isExportSuccess).to.be.true;
    });
  });

  describe('isShowingError', () => {
    it('should return true when export is in progress and allergies error exists', () => {
      const propsWithError = {
        ...defaultProps,
        allergiesError: { message: 'API Error' },
      };

      const { result } = renderHook(() => useRxExport(propsWithError));

      act(() => {
        result.current.startExport(EXPORT_FORMAT.PDF);
      });

      expect(result.current.isShowingError).to.be.true;
    });

    it('should return true when hasExportError is true', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      act(() => {
        result.current.setExportError(true);
      });

      expect(result.current.isShowingError).to.be.true;
    });

    it('should return false when no errors exist', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      expect(result.current.isShowingError).to.be.false;
    });
  });

  describe('exportService', () => {
    it('should provide access to the export service', () => {
      const { result } = renderHook(() => useRxExport(defaultProps));

      expect(result.current.exportService).to.be.an('object');
      expect(result.current.exportService.pdfBuilder).to.be.an('object');
      expect(result.current.exportService.txtBuilder).to.be.an('object');
    });

    it('should memoize export service based on dependencies', () => {
      const { result, rerender } = renderHook(props => useRxExport(props), {
        initialProps: defaultProps,
      });

      const initialService = result.current.exportService;

      // Rerender with same props
      rerender(defaultProps);
      expect(result.current.exportService).to.equal(initialService);

      // Rerender with different userName
      rerender({ ...defaultProps, userName: { first: 'Jane', last: 'Doe' } });
      expect(result.current.exportService).to.not.equal(initialService);
    });
  });
});
