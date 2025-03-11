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

const SmocContextProvider = ({ children }) => {
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

  return (
    <SmocContext.Provider
      value={{
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
      }}
    >
      {children}
    </SmocContext.Provider>
  );
};

SmocContextProvider.propTypes = {
  children: PropTypes.node,
};

export default SmocContextProvider;
