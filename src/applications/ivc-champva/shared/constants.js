import PropTypes from 'prop-types';

export const ConfirmationPagePropTypes = {
  form: PropTypes.shape({
    pages: PropTypes.object,
    data: PropTypes.shape({
      applicants: PropTypes.array,
      statementOfTruthSignature: PropTypes.string,
      veteransFullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({ confirmationNumber: PropTypes.string }),
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};
