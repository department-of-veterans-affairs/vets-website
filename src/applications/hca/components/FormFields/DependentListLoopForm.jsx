import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import {
  dependentSchema as schema,
  dependentUISchema as uiSchema,
} from '../../definitions/dependent';
import { isLoggedOut as authSelector } from '../../utils/selectors';
import DependentSIPWarning from '../FormAlerts/DependentSIPWarning';

const DependentListLoopForm = props => {
  const { children, data, page, onChange, onSubmit } = props;
  const isLoggedOut = useSelector(authSelector);
  const { fullName = {} } = data || {};

  // build the uiSchema title attribute based on form data & page
  const nameToDisplay =
    page.id !== 'basic' ? `${fullName.first} ${fullName.last}` : 'Dependent';
  const currentUISchema = {
    ...uiSchema[page.id],
    'ui:title': (
      <span className="dd-privacy-mask" data-dd-action-name="Page title">
        {page.title.replace(/%s/g, nameToDisplay)}
      </span>
    ),
  };

  return (
    <>
      {!isLoggedOut ? <DependentSIPWarning /> : null}
      <SchemaForm
        name="Dependent"
        title="Dependent"
        data={data}
        uiSchema={currentUISchema}
        schema={schema[page.id]}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        {children}
      </SchemaForm>
    </>
  );
};

DependentListLoopForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  data: PropTypes.object,
  page: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default DependentListLoopForm;
