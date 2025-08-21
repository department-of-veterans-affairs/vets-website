import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const EvidenceVaDates = ({
  content,
  currentData,
  handlers,
  showError,
}) => (
  <>
    <VaDate
      id="txdate"
      name="txdate"
      monthYearOnly
      error={showError('treatmentDate')}
      label={content.treatmentDate}
      onDateChange={handlers.onChange}
      onDateBlur={handlers.onBlur}
      value={currentData.treatmentDate}
    />
    <VaCheckbox
      id="nodate"
      name="nodate"
      class="vads-u-margin-bottom--4"
      label={content.noDate}
      onVaChange={handlers.onChange}
      checked={currentData.noDate}
    />
  </>
);

EvidenceVaDates.propTypes = {
  content: PropTypes.shape({
    noDate: PropTypes.bool,
    treatmentDate: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    noDate: PropTypes.bool,
    treatmentDate: PropTypes.string,
  }),
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  showError: PropTypes.func,
};
