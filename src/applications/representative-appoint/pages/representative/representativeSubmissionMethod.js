import RepresentativeSubmissionMethod from '../../components/RepresentativeSubmissionMethod';

export const uiSchema = {
  representativeSubmissionMethod: {
    'ui:title': "Select how you'd like to submit your request",
    'ui:widget': RepresentativeSubmissionMethod,
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
    },
    'ui:required': () => true,
  },
};

export const schema = {
  type: 'object',
  properties: {
    representativeSubmissionMethod: {
      type: 'string',
    },
  },
};

export const pageDepends = formData => {
  const { v2IsEnabled } = formData;
  // temporarily hardcoding these values

  const userCanSubmitDigitally = true;
  const representativeAcceptsDigitalSubmission = true;

  return (
    v2IsEnabled &&
    userCanSubmitDigitally &&
    representativeAcceptsDigitalSubmission
  );
};
