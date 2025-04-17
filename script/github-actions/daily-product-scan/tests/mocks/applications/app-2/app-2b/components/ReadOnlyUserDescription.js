import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { LOA_LEVEL_REQUIRED } from '../constants';

const ReadOnlyUserDescription = props => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  useEffect(() => {
    setIsLoggedIn(props.isLoggedIn);
  }, [props]);
  const display = {
    'Your first name': props?.profile?.userFullName?.first || '',
    'Your middle name': props?.profile?.userFullName?.middle || '',
    'Your last name': props?.profile?.userFullName?.last || '',
    Suffix: props?.profile?.userFullName?.suffix || '',
    'Date of birth': props?.profile?.dob
      ? moment(props?.profile?.dob).format('MMMM D, YYYY')
      : '',
  };

  return (
    <>
      {!isLoggedIn ||
      props.profile.loa.current !== LOA_LEVEL_REQUIRED ? null : (
        <>
          <div className="form-review-panel-page-header-row">
            <h4 className="vads-u-font-size--h5 vads-u-margin--0">
              Claimant Information
            </h4>
          </div>
          <dl className="review vads-u-border-bottom--0">
            {Object.entries(display).map(([label, value]) => {
              return value ? (
                <div key={label} className="review-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ) : null;
            })}
          </dl>
        </>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  profile: state?.user?.profile,
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
});

export default connect(mapStateToProps)(ReadOnlyUserDescription);
