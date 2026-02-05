import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Context for sharing CCD download state and handlers between
 * DownloadReportPage and its child components (VistaOnlyContent,
 * OHOnlyContent, VistaAndOHContent).
 *
 * This eliminates prop drilling of shared props across the download
 * report component hierarchy.
 */
const DownloadReportContext = createContext(null);

/**
 * Provider component that wraps child components with download report context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @param {Object} props.value - Context value containing all shared state and handlers
 */
export const DownloadReportProvider = ({ children, value }) => {
  // Memoize the context value to prevent unnecessary re-renders
  const memoizedValue = useMemo(() => value, [value]);

  return (
    <DownloadReportContext.Provider value={memoizedValue}>
      {children}
    </DownloadReportContext.Provider>
  );
};

DownloadReportProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    // Feature flags
    ccdExtendedFileTypeFlag: PropTypes.bool,
    // CCD state
    generatingCCD: PropTypes.bool,
    ccdError: PropTypes.bool,
    ccdDownloadSuccess: PropTypes.bool,
    CCDRetryTimestamp: PropTypes.string,
    // Handlers
    handleDownloadCCD: PropTypes.func,
    handleDownloadCCDV2: PropTypes.func,
    // Alert state
    activeAlert: PropTypes.object,
    // Test utilities
    runningUnitTest: PropTypes.bool,
    // Facility data (optional, not used by all components)
    vistaFacilityNames: PropTypes.arrayOf(PropTypes.string),
    ohFacilityNames: PropTypes.arrayOf(PropTypes.string),
    // Self-entered accordion state (optional, only used by VistaOnlyContent)
    expandSelfEntered: PropTypes.bool,
    selfEnteredAccordionRef: PropTypes.object,
  }).isRequired,
};

/**
 * Custom hook to consume the download report context.
 *
 * @returns {Object} Context value containing CCD state, handlers, and feature flags
 * @throws {Error} If used outside of a DownloadReportProvider
 *
 * @example
 * const { generatingCCD, handleDownloadCCD, ccdExtendedFileTypeFlag } = useDownloadReport();
 */
export const useDownloadReport = () => {
  const context = useContext(DownloadReportContext);
  if (context === null) {
    throw new Error(
      'useDownloadReport must be used within a DownloadReportProvider',
    );
  }
  return context;
};

export default DownloadReportContext;
