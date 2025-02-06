import RepresentativeSubmissionMethod from '../../components/RepresentativeSubmissionMethod';
import { entityAcceptsDigitalPoaRequests } from '../../utilities/helpers';

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
  const { userIsDigitalSubmitEligible, v2IsEnabled } = formData;
  const entity = formData['view:selectedRepresentative'];

  const representativeAcceptsDigitalSubmission = entityAcceptsDigitalPoaRequests(
    entity,
  );

  return (
    v2IsEnabled &&
    userIsDigitalSubmitEligible &&
    representativeAcceptsDigitalSubmission
  );
};
