import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { format } from 'date-fns';
import { fetchUser } from '../../my-education-benefits/selectors/userDispatch';
import Layout from '../../education-letters/components/Layout';
import FormFooter from '../../my-education-benefits/components/FormFooter';
// import ApprovedUI from '../components/approvedUI';
// import DeniedUI from '../components/deniedUI';
import { FETCH_CLAIM_TOE } from '../actions';
import { apiRequest } from '../../letters/utils/helpers';
import UnderReview from '../components/underReview';

const App = ({ user }) => {
  const [claimStatus, setClaimStatus] = useState(null);
  // const [isLoading, setLoading] = useState(true);
  const [dateReceived, setDateReceived] = useState('September 8, 2021');

  useEffect(
    () => {
      const checkIfClaimantCanTOE = async () =>
        apiRequest(FETCH_CLAIM_TOE)
          .then(response => {
            setClaimStatus(response?.data?.attributes?.claimStatus);
            setDateReceived(
              format(
                new Date(response?.data?.attributes?.dateReceived),
                'MMMM d, yyyy',
              ),
            );
            // setLoading(false);
            return response?.data?.attributes?.claimantId;
          })
          .catch(err => {
            if (user) {
              // window.location.href = '/';
            }
            return err;
          });

      checkIfClaimantCanTOE().then(r => r);
    },
    [claimStatus, user],
  );

  const user2 = {
    fullName: 'Hector Oliver Stanley Jr.',
    confirmationNumber: 'V-EBC-8827',
    dateReceived: 'September 8, 2021',
  };

  const renderUI = () => {
    // if (!isLoading) {

    return <UnderReview dateReceived={dateReceived} user={user2} />;

    // if (claimStatus === true)
    //   return <ApprovedUI dateReceived={dateReceived} user={user2} />;
    // return <DeniedUI dateReceived={dateReceived} user={user2} />;
    // }
    // return (
    //   <div className="vads-u-margin-y--5">
    //     <va-loading-indicator
    //       label="Loading"
    //       message="Please wait while we load the application for you."
    //       set-focus
    //     />
    //   </div>
    // );
  };

  return (
    <>
      <Layout
        clsName="main"
        breadCrumbs={{
          href: '/education/1990',
          text: 'Apply to use transferred education benefits',
        }}
      >
        <FormTitle title="Apply to use transferred education benefits " />
        <p className="va-introtext">
          Equal to VA Form 22-1990e (Application for Family Member to Use
          Transferred Benefits)
        </p>
        {renderUI()}
        {/* {!isLoading && ( */}
        <>
          <FormFooter />
        </>
        {/* )} */}
      </Layout>
    </>
  );
};

App.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: fetchUser(state),
});

export default connect(mapStateToProps)(App);
