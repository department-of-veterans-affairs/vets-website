import SubmissionMethod from '../../components/SubmissionMethod';

export const uiSchema = {
  representativeSubmissionMethod: {
    'ui:title': "Select how you'd like to submit your request",
    'ui:widget': SubmissionMethod,
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

export const pageDepends = () => {
  // temporarily hardcoding these values
  const userCanSubmitDigitally = true;
  const representativeAcceptsDigitalSubmission = true;

  return userCanSubmitDigitally && representativeAcceptsDigitalSubmission;
};
