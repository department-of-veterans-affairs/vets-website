import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SharedExplainer from './SharedExplainer';

const SpouseExplainer = ({ goBack, goToPath }) => {
  const formData = useSelector(state => state.form.data) || {}; // Added default value
  const { 'view:enhancedFinancialStatusReport': enhancedFSR } = formData;

  const handlers = {
    onSubmit: () => {
      // Renamed from onUpdate to onSubmit
      const path = !enhancedFSR
        ? 'spouse-employment'
        : 'enhanced-spouse-employment-question';
      goToPath(path);
    },
  };

  return (
    <SharedExplainer
      headline="You added a spouse" // Updated headline
      paragraph1="You will now be asked additional questions about your spouse's income and employment." // Updated text
      paragraph2="After you answer these questions, you can continue back to the review page." // Updated text
      goBack={goBack}
      goToPath={handlers.onSubmit} // Updated here too
      explainerType="Spouse"
    />
  );
};

SpouseExplainer.propTypes = {
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
};

export default SpouseExplainer;
