import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from '~/platform/user/authentication/components/VerifyAlert';

export default function VerifyIdentity({ dataTestId }) {
  return (
    <div data-testid={dataTestId}>
      <VerifyAlert headingLevel={2} />
    </div>
  );
}

VerifyIdentity.propTypes = {
  dataTestId: PropTypes.string,
};
