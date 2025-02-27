import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';
import { schema, uiSchema } from '../pages/claimant/claimantType';
import GetFormHelp from './GetFormHelp';

const ClaimantTypeForm = props => {
  const { data, onGoBack, onChange, onSubmit } = props;

  return (
    <div className="vads-u-margin-top--2p5">
      <FormTitle
        title="Request help from a VA accredited representative or VSO"
        subTitle="VA Forms 21-22 and 21-22a"
      />
      <h3>Tell us who you are</h3>{' '}
      <SchemaForm
        name="Claimant Form"
        title="Claimant Form"
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        data={data}
      >
        <FormNavButtons goBack={onGoBack} submitToContinue />
        <div>
          <h2 className="help-heading">Need help?</h2>
          <GetFormHelp />
        </div>
      </SchemaForm>
    </div>
  );
};

ClaimantTypeForm.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  onLogin: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ClaimantTypeForm;
