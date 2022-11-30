import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// updatePage isn't available for CustomPage on non-review pages, see
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/33797
import { setData } from 'platform/forms-system/src/js/actions';

const AddEmployment = props => {
  const { goToPath } = props;

  const returnPath = '/employment-records';

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onCancel: event => {
      event.preventDefault();
      goToPath(returnPath);
    },
    onUpdate: event => {
      // Add to array and potentially move to next screen or loop again
      event.preventDefault();
      goToPath(returnPath);
    },
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset>
        <div className="vads-u-margin-bottom--2">
          HELLO YES NO TIME
          <va-radio error={null} label="This is a label">
            <va-radio-option label="Option one" name="example" value="1" />
            <va-radio-option label="Option two" name="example" value="2" />
          </va-radio>
        </div>
        <p>
          <button
            type="button"
            id="cancel"
            className="usa-button-secondary vads-u-width--auto"
            onClick={handlers.onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit"
            className="vads-u-width--auto"
            onClick={handlers.onUpdate}
          >
            Continue
          </button>
        </p>
      </fieldset>
    </form>
  );
};

AddEmployment.propTypes = {
  data: PropTypes.shape({}),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  onReviewPage: PropTypes.bool,
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(AddEmployment);

export { AddEmployment };
