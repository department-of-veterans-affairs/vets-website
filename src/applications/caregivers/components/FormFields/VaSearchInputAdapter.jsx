import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import { VaSearchInput } from '../../utils/imports';

const VaSearchInputAdapter = forwardRef(
  ({ onInput, onSubmit, ...props }, ref) => {
    useEffect(
      () => {
        const el = ref?.current;
        const handleInput = e => onInput?.(e);
        const handleSubmit = e => onSubmit?.(e);

        el?.addEventListener('input', handleInput);
        el?.addEventListener('submit', handleSubmit);

        return () => {
          el?.removeEventListener('input', handleInput);
          el?.removeEventListener('submit', handleSubmit);
        };
      },
      [onInput, onSubmit, ref],
    );
    return <VaSearchInput ref={ref} {...props} />;
  },
);

VaSearchInputAdapter.propTypes = {
  label: PropTypes.string,
  query: PropTypes.string,
  onInput: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default VaSearchInputAdapter;
