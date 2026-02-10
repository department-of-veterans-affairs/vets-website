import { VaCard, VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { ServerErrorAlert } from '../config/helpers';

const BusinessPersonal = ({
  formData,
}) => {
  const [error] = useState(false);
  const dispatch = useDispatch();

  useEffect(
    () => {
      focusElement('h2');
    },
    [formData.aboutYourself],
  );

  return !error ? (
    <>
        <div display="flex" flex-direction="row" gap="4">
            <VaCard 
                icon-name="account_circle"
            >
            <div>
                <h3 className="vads-u-margin-top--1">
                Personal Support
                </h3>
                <p>
                Use this option if you're a Veteran, family member, caregiver, or survivor - or if your asking a question for a veteran you know personally.
                </p>
                <VaLink className="vads-c-action-link--blue" to="/your-personal-information">
                Ask a question
                </VaLink>
            </div>
            </VaCard>
            <VaCard 
                icon-name="work"
            >
            <div>
                <h3 className="vads-u-margin-top--1">
                Work-related Support
                </h3>
                <p>
                Use this option if you are from an organization contacting VA about a Veteran as a part of your job (for example, a VSO, provider or case manager).
                </p>
                <VaLink className="vads-c-action-link--blue" to="/">
                Ask a question
                </VaLink>
            </div>
            </VaCard>
        </div>
    </>
  ) : (
    <ServerErrorAlert />
  );
};

BusinessPersonal.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(withRouter(BusinessPersonal));
