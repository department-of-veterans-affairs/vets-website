import React from 'react';
import PropTypes from 'prop-types';
import { createLiteralMap, normalizeFullName } from '../../utils/helpers';

const CancelDependentActionDescription = ({ formData = {}, mode }) => {
  const { fullName = {} } = formData || {};
  const dependentName = normalizeFullName(fullName);
  const contentMap = createLiteralMap([
    [
      <>
        This will stop adding the dependent. You’ll return to a list of any
        previously added dependents and this dependent will not be added.
      </>,
      ['add'],
    ],
    [
      <>
        This will stop editing <strong>{dependentName}</strong>. You will return
        to a list of any previously added dependents and your edits will not be
        applied.
      </>,
      ['edit', 'update'],
    ],
  ]);

  return (
    <p className="vads-u-margin--0" data-testid="cancel-action-description">
      {contentMap[mode]}
    </p>
  );
};

CancelDependentActionDescription.propTypes = {
  formData: PropTypes.object,
  mode: PropTypes.string,
};

export default CancelDependentActionDescription;
