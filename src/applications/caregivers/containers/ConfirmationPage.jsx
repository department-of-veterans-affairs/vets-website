import React, { useEffect } from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'applications/claims-status/utils/page';

const ConfirmationPage = props => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  const { submission, data } = props.form;
  const { response } = submission;
  const name = data.veteranFullName;

  return (
    <section>
      <AlertBox
        headline="Your submission was successful."
        content="Once we’ve reviewed your application, a Caregiver Support Coordinator will contact you to discuss next steps."
        status="success"
      />
      <div className="inset vads-u-margin-top--4">
        <h4>
          Application for Comprehensive Assistance for Family Caregivers Program
          (VA Form 10-10CG)
        </h4>

        <span>
          for {name.first} {name.middle} {name.last} {name.suffix}
        </span>

        {response && (
          <ul className="claim-list">
            <li>
              <strong>Date received</strong>
              <br />
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);
