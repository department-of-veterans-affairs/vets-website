import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAppData } from '../selectors/selectors';

function GetFormHelp({ showMebDgi40Features }) {
  return (
    <p className="help-talk">
      {showMebDgi40Features ? (
        <>
          If you need help with your application or have questions about
          enrollment or eligibility, submit a request with{' '}
          <a target="_blank" href="https://ask.va.gov/" rel="noreferrer">
            {' '}
            Ask VA.{' '}
          </a>{' '}
          <p>
            If you have technical difficulties using this online application,
            call our MyVA411 main information line at{' '}
            <va-telephone contact="8006982411" /> (TTY:{' '}
            <va-telephone contact="711" />
            ). We're here 24/7.
          </p>
        </>
      ) : (
        <>
          If you need help with your application or have questions about
          enrollment or eligibility, call our Education Call Center at{' '}
          <va-telephone contact="8884424551" />. We're here Monday through
          Friday, 8:00 a.m. to 7:00 p.m. ET. If you're outside the U.S., call us
          at <va-telephone international contact="9187815678" />.<br />
          <br />
          If you have technical difficulties using this online application, call
          our MyVA411 main information line at{' '}
          <va-telephone contact="8006982411" /> (TTY:{' '}
          <va-telephone contact="711" />
          ). We're here 24/7.
        </>
      )}
    </p>
  );
}

GetFormHelp.propTypes = {
  showMebDgi40Features: PropTypes.bool,
};

const mapStateToProps = state => getAppData(state);

export default connect(mapStateToProps)(GetFormHelp);
