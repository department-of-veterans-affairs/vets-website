import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  dependentSchema as schema,
  dependentUISchema as uiSchema,
} from '../definitions/dependent';
import {
  normalizeFullName,
  replaceStrValues,
} from '../../../../utils/helpers/general';
import content from '../../../../shared/locales/en/content.json';
import SaveInProgressWarning from './SaveInProgressWarning';

const DependentListLoopForm = props => {
  const { children, data, page, onChange, onSubmit } = props;
  const { fullName = {} } = data || {};

  // build the uiSchema title attribute based on form & page data
  const nameToDisplay =
    page.id !== 'basic'
      ? normalizeFullName(fullName)
      : content['household-dependent-generic-label'];
  const currentUISchema = {
    ...uiSchema[page.id],
    ...titleUI(
      <span className="dd-privacy-mask" data-dd-action-name="Page title">
        {replaceStrValues(page.title, nameToDisplay)}
      </span>,
    ),
  };

  return (
    <>
      <SaveInProgressWarning type="dependent" />
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
