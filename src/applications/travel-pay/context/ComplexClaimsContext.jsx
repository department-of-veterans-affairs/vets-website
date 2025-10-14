import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const defaultContext = {
  pageIndex: 0,
  setPageIndex: null,
  isSubmitting: false,
  setIsSubmitting: null,
  submissionComplete: false,
  setSubmissionComplete: null,
};

export const ComplexClaimsContext = createContext(defaultContext);

const ComplexClaimsContextProvider = ({ children, value }) => {
  const [pageIndex, setPageIndex] = useState(defaultContext.pageIndex);
  const [isSubmitting, setIsSubmitting] = useState(defaultContext.isSubmitting);
  const [submissionComplete, setSubmissionComplete] = useState(
    defaultContext.submissionComplete,
  );

  const state = {
    pageIndex,
    setPageIndex,
    isSubmitting,
    setIsSubmitting,
    submissionComplete,
    setSubmissionComplete,
  };

  return (
    <ComplexClaimsContext.Provider
      value={{
        ...state,
        ...(value ?? {}),
      }}
    >
      {children}
    </ComplexClaimsContext.Provider>
  );
};

ComplexClaimsContextProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.shape({
    pageIndex: PropTypes.number,
    setPageIndex: PropTypes.func,
    isSubmitting: PropTypes.bool,
    setIsSubmitting: PropTypes.func,
    submissionComplete: PropTypes.bool,
    setSubmissionComplete: PropTypes.func,
  }),
};

export default ComplexClaimsContextProvider;
