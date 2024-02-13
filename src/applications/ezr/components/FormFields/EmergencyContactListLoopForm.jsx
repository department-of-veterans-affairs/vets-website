import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  emergencyContactSchema as schema,
  emergencyContactUISchema as uiSchema,
} from '../../definitions/emergencyContact';
import SaveInProgressWarning from '../FormAlerts/SaveInProgressWarning';

const EmergencyContactListLoopForm = props => {
  const { emergencyContact, data, page, onChange, onSubmit } = props;
  const currentUISchema = {
    ...uiSchema[page.id],
    ...titleUI(
      <span className="dd-privacy-mask" data-dd-action-name="Page title">
        {page.title}
      </span>,
    ),
  };

  return (
    <>
      <SaveInProgressWarning type="medical emergency contact" />
      <SchemaForm
        name="Medical emergency contact"
        title="Medical emergency contact"
        data={data}
        uiSchema={currentUISchema}
        schema={schema[page.id]}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        {emergencyContact}
      </SchemaForm>
    </>
  );
};

EmergencyContactListLoopForm.propTypes = {
  emergencyContact: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  data: PropTypes.object,
  page: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default EmergencyContactListLoopForm;
