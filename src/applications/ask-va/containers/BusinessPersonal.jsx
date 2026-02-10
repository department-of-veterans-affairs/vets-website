import { VaCard, VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { ServerErrorAlert } from '../config/helpers';
// import { Link } from 'react-router-dom';
// import { Link } from 'platform/site-wide/routing';

const BusinessPersonal = ({
  formData,
}) => {
  const [error] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
  })


  return !error ? (
    <>
    <div className="vads-l-grid-container">
    <div className="vads-l-row vads-u-justify-content--center vads-u-margin-bottom--10">
      {/* Card 1: 12 columns on mobile (stacked), 6 columns on tablet+ (side-by-side) */}
      <div className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-padding--2 vads-u-background-color--yellow">
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
                  {/* <a 
                    href="/contact-us/ask-va/initial-question"
                    onClick={handleNavigation}
                    className="vads-c-action-link--blue"
                  >
                    Ask a new question
                  </a> */}
                  {/* <button 
                    type="button"
                    onClick={handleClick}
                    className="vads-c-action-link--blue vads-u-padding--0 vads-u-margin--0"
                    style={{ background: 'none', border: 'none', textAlign: 'left' }}
                  >
                    Ask a new question
                  </button> */}
                  {/* <va-link
                    active
                    href="/contact-us/ask-va/initial-question"
                    text="Ask a new question"
                  /> */}
                  {/* <div className="vads-u-margin-top--4">
                  <Link 
                    to="/contact-us/ask-va/initial-question" 
                    className="vads-c-action-link--blue"
                  >
                    Ask a new question
                  </Link>
                  </div> */}
                  <va-link-action
                    href="/contact-us/ask-va/initial-question"
                    text="Ask a new question"
                    type="secondary"
                    external={false}
                  />
                  {/* <a href="/initial-question" class="vads-c-action-link--blue">Ask a new question</a> */}
                  {/* <VaLink className="vads-c-action-link--blue" to="">
                  Ask a question
                  </VaLink> */}
              </div>
              </VaCard>
      </div>

      {/* Card 2 */}
      <div className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-padding--2">
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
                  <va-link-action
                    href="/contact-us/ask-va/"
                    text="Ask a new question"
                    type="secondary"
                    external={false}
                  />
                   {/* <a href="/" class="vads-c-action-link--blue">Ask a new question</a> */}
                  {/* <VaLink className="vads-c-action-link--blue" to="/">
                  Ask a question
                  </VaLink> */}
              </div>
              </VaCard>
      </div>
    </div>
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
