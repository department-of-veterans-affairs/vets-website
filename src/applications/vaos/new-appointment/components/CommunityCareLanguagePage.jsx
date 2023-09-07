import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import FormButtons from '../../components/FormButtons';
import { LANGUAGES } from '../../utils/constants';
import * as actions from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';

const initialSchema = {
  type: 'object',
  required: ['preferredLanguage'],
  properties: {
    preferredLanguage: {
      type: 'string',
      enum: LANGUAGES.map(l => l.id),
      enumNames: LANGUAGES.map(l => l.text),
    },
  },
};

const uiSchema = {
  preferredLanguage: {
    'ui:title':
      'Select your language preference for your community care provider.',
  },
};

const pageKey = 'ccLanguage';
const pageTitle = 'Choose a preferred language';

function CommunityCareLanguagePage({
  schema,
  data,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
  openFormPage,
}) {
  const history = useHistory();
  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openFormPage(pageKey, uiSchema, initialSchema);
    },
    [openFormPage],
  );

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="ccLanguage"
          title={pageTitle}
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
          data={data}
        >
          <FormButtons
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...getFormPageInfo(state, pageKey),
  };
}

const mapDispatchToProps = {
  openFormPage: actions.openFormPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCareLanguagePage);

CommunityCareLanguagePage.propTypes = {
  data: PropTypes.object.isRequired,
  openFormPage: PropTypes.func.isRequired,
  pageChangeInProgress: PropTypes.bool.isRequired,
  routeToNextAppointmentPage: PropTypes.func.isRequired,
  routeToPreviousAppointmentPage: PropTypes.func.isRequired,
  updateFormData: PropTypes.func.isRequired,
  schema: PropTypes.object,
};
