import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  Link,
  useHistory,
} from 'react-router-dom';
import { selectAllowProjectCheetahBookings } from './redux/selectors';
import projectCheetahReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import InfoPage from './components/InfoPage';
import VAFacilityPage from './components/VAFacilityPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import SelectDate1Page from './components/SelectDate1Page';
import SelectDate2Page from './components/SelectDate2Page';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import FullWidthLayout from '../components/FullWidthLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import { selectFeatureProjectCheetah } from '../redux/selectors';

export function NewBookingSection({ allowBookings, featureProjectCheetah }) {
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(
    () => {
      if (!featureProjectCheetah) {
        history.push('/');
      }
    },
    [featureProjectCheetah, history],
  );

  if (!allowBookings) {
    return (
      <FullWidthLayout>
        <Breadcrumbs>
          <Link to="new-project-cheetah-booking">Project Cheetah Booking</Link>
        </Breadcrumbs>
        <AlertBox
          headline="Please contact your VA facility"
          status="warning"
          className="vads-u-margin-top--0p5 vads-u-margin-bottom--4"
          isVisible
        >
          You should contact your doctor or the{' '}
          <a href="/find-locations">nearest VA facility</a> if you have
          questions about project cheetah.
        </AlertBox>
      </FullWidthLayout>
    );
  }

  return (
    <FormLayout>
      {allowBookings && (
        <Switch>
          <Route path={`${match.url}/facility`} component={VAFacilityPage} />
          <Route path={`${match.url}/clinic`} component={ClinicChoicePage} />
          <Route
            path={`${match.url}/select-date-1`}
            component={SelectDate1Page}
          />
          <Route
            path={`${match.url}/select-date-2`}
            component={SelectDate2Page}
          />
          <Route path={`${match.url}/review`} component={ReviewPage} />
          <Route
            path={`${match.url}/confirmation`}
            component={ConfirmationPage}
          />
          <Route path="/" component={InfoPage} />
        </Switch>
      )}
    </FormLayout>
  );
}

function mapStateToProps(state) {
  return {
    featureProjectCheetah: selectFeatureProjectCheetah(state),
    allowBookings: selectAllowProjectCheetahBookings(state),
  };
}

export const NewBooking = connect(mapStateToProps)(NewBookingSection);

export const reducer = projectCheetahReducer;
