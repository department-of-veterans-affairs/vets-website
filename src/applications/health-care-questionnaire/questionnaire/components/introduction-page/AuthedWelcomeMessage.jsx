import React from 'react';
import ActionLink from '../../../shared/components/action-link';

export default function AuthedWelcomeMessage(props) {
  const { goToFirstPage } = props;
  return (
    <>
      <div className="usa-alert usa-alert-info schemaform-sip-alert">
        <div className="usa-alert-body">
          <strong>Note:</strong> Since you’re signed in to your account, we can
          prefill part of your questions based on your account details. You can
          also save your questions in progress and come back later to finish
          filling it out.
        </div>
      </div>
      <section className="action-link-container">
        <ActionLink
          onClick={goToFirstPage}
          ariaLabe="Answer questions"
          usePrimary
        >
          Answer questions
        </ActionLink>
      </section>
    </>
  );
}
