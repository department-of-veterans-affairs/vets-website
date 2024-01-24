import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import FormSaved from 'platform/forms/save-in-progress/FormSaved';

import { formatDate } from '../utils';

const FormSavedPage = props => {
  const date = props.itf?.currentITF?.expirationDate;
  const itfExpirationDate = date ? formatDate(date) : 'Unknown';
  const expirationMessage = (
    <>
      <p className="expires-container">
        You’ll need to complete your saved application by{' '}
        <span className="expires">{itfExpirationDate}</span> so you can get back
        pay for any awarded benefits from your Intent to File date.
      </p>
      <va-additional-info trigger="What is an Intent to File?" uswds>
        An Intent to File lets VA know that you’re planning to file a claim and
        reserves a potential effective date for when you could start getting
        benefits. For you, this means you may get back pay starting from{' '}
        {itfExpirationDate}.
      </va-additional-info>
    </>
  );

  return <FormSaved {...props} expirationMessage={expirationMessage} />;
};

const mapStateToProps = state => ({ itf: state.itf });

export default connect(mapStateToProps)(FormSavedPage);
