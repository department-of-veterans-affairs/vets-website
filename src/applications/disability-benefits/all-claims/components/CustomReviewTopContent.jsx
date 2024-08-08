import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TE_URL_PREFIX } from '../constants';
import { isClaimingNew } from '../utils';

function CustomReviewTopContent({ formData }) {
  const [isVisible, setIsVisible] = useState(true);

  if (
    formData?.startedFormVersion !== '2019' ||
    !isClaimingNew(formData) ||
    formData?.newDisabilities?.length < 1
  ) {
    return null;
  }

  return (
    <>
      <VaAlert
        closeable
        onCloseEvent={() => {
          setIsVisible(false);
        }}
        status="info"
        visible={isVisible}
      >
        <h2 slot="headline">We updated our online form</h2>
        <p>
          You should know that we updated our online form. We have some new
          questions for you to answer about toxic exposure.
        </p>
        <p>Your answers may support your claim for disability compensation.</p>
        <p>
          <Link
            to={{
              pathname: `${TE_URL_PREFIX}/conditions`,
              search: '?redirect',
            }}
          >
            Answer our new questions
          </Link>
        </p>
      </VaAlert>
    </>
  );
}

CustomReviewTopContent.propTypes = {
  formData: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    formData: state.form.data,
  };
};

export default connect(mapStateToProps)(CustomReviewTopContent);
