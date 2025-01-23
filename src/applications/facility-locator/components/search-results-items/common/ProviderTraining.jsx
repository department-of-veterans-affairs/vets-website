import React from 'react';
import PropTypes from 'prop-types';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function ProviderTraining({ provider }) {
  if (!provider.attributes.trainings?.length) {
    return null;
  }
  return (
    <p className="vads-u-margin-y--2" data-testid={`training-${provider.id}`}>
      <VaIcon
        size={3}
        icon="how_to_reg"
        className="vads-u-margin-right--1 success-icon"
      />
      Provider core training
    </p>
  );
}

ProviderTraining.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    attributes: PropTypes.shape({
      trainings: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }),
};

export default ProviderTraining;
