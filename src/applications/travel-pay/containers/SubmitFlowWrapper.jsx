import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
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

import { appointment1 } from '../services/mocks/appointments';
import CantFilePage from '../components/submit-flow/pages/CantFilePage';

const SubmitFlowWrapper = ({ address }) => {
  // const location = useLocation();
  // const { appointment = null } = location.state ?? {};

  const appointment = appointment1;

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

  const [yesNo, setYesNo] = useState({
    mileage: '',
    vehicle: '',
    address: '',
  });
  const [cantFile, setCantFile] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);

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
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          setYesNo={setYesNo}
          yesNo={yesNo}
          setCantFile={setCantFile}
        />
      ),
    },
    {
      page: 'vehicle',
      component: (
        <VehiclePage
          setYesNo={setYesNo}
          yesNo={yesNo}
          setCantFile={setCantFile}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
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
          setCantFile={setCantFile}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
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
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
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
        {cantFile ? (
          <CantFilePage
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            setCantFile={setCantFile}
          />
        ) : (
          pageList[pageIndex].component
        )}
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
