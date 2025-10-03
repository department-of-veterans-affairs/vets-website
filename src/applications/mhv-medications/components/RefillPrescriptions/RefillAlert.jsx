import React from 'react';
import PropTypes from 'prop-types';

export const RefillAlert = ({ config, children, additionalProps = {} }) => {
  return (
    <va-alert
      id={config.id}
      data-testid={config.testId}
      status={config.status}
      set-focus
      uswds
      class={config.className}
      {...additionalProps}
    >
      <h2
        className="vads-u-margin-y--0 vads-u-font-size--h3"
        data-testid={`${config.testId}-title`}
      >
        {config.title}
      </h2>
      {children}
    </va-alert>
  );
};

RefillAlert.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    id: PropTypes.string.isRequired,
    testId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  additionalProps: PropTypes.object,
};

export default RefillAlert;
