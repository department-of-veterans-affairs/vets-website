import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const IdentityPageDescription = () => (
  <>
    <FormTitle
      title="Before you start your application"
      // TODO: replace with shared string so this isn't in multiple places
      subTitle="Marital Status Questionnaire (VA Form 21P-0537)"
    />
    <p>
      We need some information before you can start your application. This will
      help us ensure your application contains all needed information. Then you
      can fill out the VA Marital Status Questionnaire (VA Form 21P-0537).
    </p>
  </>
);

export default IdentityPageDescription;
