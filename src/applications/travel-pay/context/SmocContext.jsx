import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const defaultContext = {
  pageIndex: 0,
  setPageIndex: () => {},
  yesNo: {
    mileage: '',
    vehicle: '',
    address: '',
  },
  isUnsupportedClaimType: false,
  setIsUnsupportedClaimType: () => {},
  isAgreementChecked: false,
  setIsAgreementChecked: () => {},
  isAgreementError: false,
  setIsAgreementError: () => {},
};

export const SmocContext = createContext(defaultContext);

const SmocContextProvider = ({ children, value }) => {
  const [yesNo, setYesNo] = useState(defaultContext.yesNo);
  const [pageIndex, setPageIndex] = useState(defaultContext.pageIndex);
  const [isUnsupportedClaimType, setIsUnsupportedClaimType] = useState(
    defaultContext.isUnsupportedClaimType,
  );
  const [isAgreementChecked, setIsAgreementChecked] = useState(
    defaultContext.isAgreementChecked,
  );
  const [isAgreementError, setIsAgreementError] = useState(
    defaultContext.isAgreementError,
  );

  const state = {
    pageIndex,
    setPageIndex,
    yesNo,
    setYesNo,
    isUnsupportedClaimType,
    setIsUnsupportedClaimType,
    isAgreementChecked,
    setIsAgreementChecked,
    isAgreementError,
    setIsAgreementError,
  };

  return (
    <SmocContext.Provider
      value={{
        ...state,
        ...(value ?? {}),
      }}
    >
      {children}
    </SmocContext.Provider>
  );
};

SmocContextProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.shape({
    yesNo: PropTypes.shape({
      mileage: PropTypes.string,
      vehicle: PropTypes.string,
      address: PropTypes.string,
    }),
    pageIndex: PropTypes.number,
    setPageIndex: PropTypes.func,
    isUnsupportedClaimType: PropTypes.bool,
    setIsUnsupportedClaimType: PropTypes.func,
    isAgreementChecked: PropTypes.bool,
    setIsAgreementChecked: PropTypes.func,
    isAgreementError: PropTypes.bool,
    setIsAgreementError: PropTypes.func,
  }),
};

export default SmocContextProvider;
