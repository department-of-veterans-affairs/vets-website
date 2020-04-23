import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import FormSaved from 'platform/forms/save-in-progress/FormSaved';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

const FormSavedPage = props => {
  const itfExpirationDate = moment(props.itf.currentITF.expirationDate).format(
    'M/D/YYYY',
  );
  const expirationMessage = (
    <Fragment>
      <p className="expires-container">
        You’ll need to complete your saved application by{' '}
        <span className="expires">{itfExpirationDate}</span> so you can get back
        pay for any awarded benefits from your Intent to File date.
      </p>
      <AdditionalInfo triggerText="What is an Intent to File?">
        An Intent to File lets VA know that you’re planning to file a claim and
        reserves a potential effective date for when you could start getting
        benefits. For you, this means you may get back pay starting from{' '}
        {itfExpirationDate}.
      </AdditionalInfo>
    </Fragment>
  );

  return <FormSaved {...props} expirationMessage={expirationMessage} />;
};

const mapStateToProps = state => ({ itf: state.itf });

export default connect(mapStateToProps)(FormSavedPage);
