import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CurrencyInputWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 0.2em;
  top: 4.7em;
  pointer-events: none; /* Make sure the input remains clickable */
`;

const StyledVaNumberInput = Component => {
  const WrappedComponent = ({ currency, ...props }) => {
    if (!currency) {
      return <Component {...props} />;
    }

    return (
      <CurrencyInputWrapper>
        <CurrencySymbol>$</CurrencySymbol>
        <Component {...props} />
      </CurrencyInputWrapper>
    );
  };

  WrappedComponent.displayName = `withCurrency(${Component.displayName ||
    Component.name})`;

  // define prop types
  WrappedComponent.propTypes = {
    currency: PropTypes.bool,
  };

  return WrappedComponent;
};

export default StyledVaNumberInput;
