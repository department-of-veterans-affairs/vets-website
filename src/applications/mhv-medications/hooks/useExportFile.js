import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PDF_TXT_GENERATE_STATUS,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
} from '../util/constants';

/**
 * Generic file export hook for PDF/TXT/PRINT that:
 * - Tracks status + shouldPrint
 * - Handles allergies gating (and propagates allergiesError as an export error in the requested format)
 * - Optionally runs a "prepare" step (e.g., fetch export list)
 * - Runs generators for PDF/TXT or triggers print
 */
const useExportFile = ({
  allergies,
  allergiesError,
  isReady,
  error,
  prepare,
  onGeneratePdf,
  onGenerateTxt,
  onBeforePrint,
  onGenerationError,
}) => {
  const [shouldPrint, setShouldPrint] = useState(false);
  const [status, setStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });
  const [generationError, setGenerationError] = useState(false);
  const [errorFormat, setErrorFormat] = useState(undefined);

  const resetExportFlow = useCallback(() => {
    setShouldPrint(false);
    setGenerationError(false);
    setErrorFormat(undefined);
    setStatus({
      status: PDF_TXT_GENERATE_STATUS.NotStarted,
      format: undefined,
    });
  }, []);

  const isLoading = useMemo(
    () => {
      return (
        status.status === PDF_TXT_GENERATE_STATUS.InProgress &&
        !allergiesError &&
        !error &&
        !generationError
      );
    },
    [status.status, allergiesError, error, generationError],
  );

  const isSuccess = useMemo(
    () => {
      return status.status === PDF_TXT_GENERATE_STATUS.Success;
    },
    [status.status],
  );

  const hasError = useMemo(
    () => {
      // If we're in progress and allergies errored, show error UI.
      // Additional errors and generation errors also show error UI.
      return (
        (status.status === PDF_TXT_GENERATE_STATUS.InProgress &&
          allergiesError) ||
        error ||
        generationError
      );
    },
    [status.status, allergiesError, error, generationError],
  );

  // prefer explicit errorFormat if set; otherwise, if allergies fail during InProgress,
  // use status.format so the UI can show the correct "download PDF/TXT/print" error.
  const effectiveErrorFormat = useMemo(
    () => {
      return (
        errorFormat ||
        (status.status === PDF_TXT_GENERATE_STATUS.InProgress && allergiesError
          ? status.format
          : undefined)
      );
    },
    [errorFormat, status.status, status.format, allergiesError],
  );

  const finalizeSuccess = useCallback(() => {
    setStatus(prev => ({
      status: PDF_TXT_GENERATE_STATUS.Success,
      format: prev.format,
    }));
  }, []);

  const handleGenerationError = useCallback(
    err => {
      setGenerationError(true);
      setErrorFormat(status.format);
      setStatus({
        status: PDF_TXT_GENERATE_STATUS.NotStarted,
        format: status.format,
      });

      if (onGenerationError) onGenerationError(err);
    },
    [status.format, onGenerationError],
  );

  const onDownload = useCallback(
    async format => {
      // clear prior generation error state
      setGenerationError(false);
      setErrorFormat(undefined);

      setStatus({ status: PDF_TXT_GENERATE_STATUS.InProgress, format });

      if (prepare) {
        try {
          await prepare(format);
        } catch (e) {
          // prepare errors are treated like generation errors here;
          // consumers can also surface these via error if they prefer.
          handleGenerationError(e);
        }
      }
    },
    [prepare, handleGenerationError],
  );

  useEffect(
    () => {
      const isInProgress = status.status === PDF_TXT_GENERATE_STATUS.InProgress;
      if (!isInProgress) return;

      const { format } = status;

      // If print requested and allergies errored, stay InProgress so the UI shows error.
      if (format === PRINT_FORMAT.PRINT) {
        if (allergiesError) return;

        // Wait for data to be ready before triggering print
        if (!isReady) return;

        if (onBeforePrint) onBeforePrint();
        setShouldPrint(true);

        // Reset status (print isn't "generated" like files are).
        setStatus({
          status: PDF_TXT_GENERATE_STATUS.NotStarted,
          format: undefined,
        });
        return;
      }

      const allergiesReady = !!allergies && !allergiesError;
      if (!isReady || !allergiesReady) {
        return;
      }

      const runGeneration = async () => {
        try {
          if (format === DOWNLOAD_FORMAT.PDF) {
            await onGeneratePdf?.();
            finalizeSuccess();
          } else if (format === DOWNLOAD_FORMAT.TXT) {
            await onGenerateTxt?.();
            finalizeSuccess();
          }
        } catch (err) {
          handleGenerationError(err);
        }
      };

      runGeneration();
    },
    [
      status,
      allergies,
      allergiesError,
      isReady,
      onGeneratePdf,
      onGenerateTxt,
      onBeforePrint,
      finalizeSuccess,
      handleGenerationError,
    ],
  );

  const clearPrintTrigger = useCallback(() => setShouldPrint(false), []);

  return {
    onDownload,
    status,
    isLoading,
    isSuccess,
    hasError,
    errorFormat: effectiveErrorFormat,
    shouldPrint,
    clearPrintTrigger,
    resetExportFlow,
  };
};

export default useExportFile;
