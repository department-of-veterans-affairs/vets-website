import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const ReviewPage = ({ onNext }) => (
  <article className="schemaform-intro">
    <FormTitle title="Static demo 2: Review" subTitle="Review" />
    <div className="vads-u-margin-top--4">
      <p>This is the simplified review page for the static demo.</p>
      <va-button onClick={onNext} text="Submit and go to confirmation" />
    </div>
  </article>
);

ReviewPage.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default ReviewPage;
