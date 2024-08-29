import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';
import { schema, uiSchema } from '../pages/claimant/claimantType';

const ClaimantTypeForm = props => {
  const { data, onGoBack, onChange, onSubmit } = props;

  return (
    <div className="vads-u-margin-top--2p5">
      <FormTitle
        title="Fill out your form to appoint a VA accredited representative or VSO"
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
