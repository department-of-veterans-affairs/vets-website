import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { Element } from 'platform/utilities/scroll';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IntroductionPage from '../components/submit-flow/pages/IntroductionPage';
import MileagePage from '../components/submit-flow/pages/MileagePage';
import VehiclePage from '../components/submit-flow/pages/VehiclePage';
import AddressPage from '../components/submit-flow/pages/AddressPage';
import ReviewPage from '../components/submit-flow/pages/ReviewPage';
import ConfirmationPage from '../components/submit-flow/pages/ConfirmationPage';
import BreadCrumbs from '../components/Breadcrumbs';
// import { useSelector } from 'react-redux';
// import {
//   selectConfirmedAppointmentData,
//   selectAppointmentById,
// } from '../../vaos/appointment-list/redux/selectors';

const SubmitFlowWrapper = ({ address }) => {
  const location = useLocation();
  const { appointment = null } = location.state ?? {};

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  // From the appts app, helpful ideas on how to normalize appt data
  // const {
  //   clinicName,
  //   clinicPhysicalLocation,
  //   clinicPhone,
  //   clinicPhoneExtension,
  //   facility,
  //   facilityPhone,
  //   locationId,
  //   isPastAppointment,
  //   practitionerName,
  //   startDate,
  //   status,
  //   typeOfCareName,
  // } = useSelector(
  //   state => selectConfirmedAppointmentData(state, appointment),
  //   shallowEqual,
  // );

  // const { apptId } = useParams();

  // These are from the appts app, but would be helpful if we can implement them

  // const appointment = useSelector(state =>
  //   selectAppointmentById(state, apptId),
  // );

  // const selectedAppointment = useSelector(state =>
  //   selectConfirmedAppointmentData(state, appointment),
  // );

  const [yesNo, setYesNo] = useState(undefined);
  const [pageIndex, setPageIndex] = useState(0);

  const onNextPage = e => {
    e.preventDefault();
    if (!yesNo) {
      // TODO: send to error page
      // console.info("You can't do that!");
    } else {
      setYesNo(undefined);
      setPageIndex(pageIndex + 1);
    }
  };

  const onPreviouspage = e => {
    e.preventDefault();
    setYesNo(undefined);
    setPageIndex(pageIndex - 1);
  };

  const onSubmit = e => {
    e.preventDefault();
    // Placeholder until actual submit is hooked up
    setPageIndex(pageIndex + 1);
  };

  const pageList = [
    {
      page: 'intro',
      component: (
        <IntroductionPage
          appointment={appointment}
          onNext={e => {
            e.preventDefault();
            setPageIndex(pageIndex + 1);
          }}
        />
      ),
    },
    {
      page: 'mileage',
      component: (
        <MileagePage
          appointment={appointment}
          onNext={onNextPage}
          onBack={onPreviouspage}
          setYesNo={setYesNo}
          yesNo={yesNo}
        />
      ),
    },
    {
      page: 'vehicle',
      component: (
        <VehiclePage
          setYesNo={setYesNo}
          yesNo={yesNo}
          onNext={onNextPage}
          onBack={onPreviouspage}
        />
      ),
    },
    {
      page: 'address',
      component: (
        <AddressPage
          address={address}
          yesNo={yesNo}
          setYesNo={setYesNo}
          onNext={onNextPage}
          onBack={onPreviouspage}
        />
      ),
    },
    {
      page: 'review',
      component: (
        <ReviewPage
          appointment={appointment}
          address={address}
          onSubmit={onSubmit}
          onBack={onPreviouspage}
        />
      ),
    },
    {
      page: 'confirm',
      component: <ConfirmationPage />,
    },
  ];

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <BreadCrumbs />
        {pageList[pageIndex].component}
      </article>
    </Element>
  );
};

SubmitFlowWrapper.propTypes = {
  address: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    address: selectVAPResidentialAddress(state),
  };
}

export default connect(mapStateToProps)(SubmitFlowWrapper);
