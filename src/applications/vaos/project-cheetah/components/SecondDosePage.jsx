import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import moment from 'moment';
import { getReviewPage } from '../redux/selectors';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const pageKey = 'secondDosePage';
const pageTitle = 'Plan your second dose';

function SecondDosePage({
  data,
  facility,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
}) {
  const history = useHistory();
  const { date1 } = data;

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <div>
        <p>
          You may need to return to the {facility.name} for a second dose. Your
          team will schedule your second dose after you receive your first.
        </p>
        <p>
          If you receive your first dose on{' '}
          <strong>{moment(date1[0]).format('dddd, MMMM DD, YYYY ')} </strong>
          and receive:
        </p>
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
          Moderna
        </h2>
        <div className="vads-u-padding-bottom--1">
          Return for your second dose after{' '}
          {moment(date1[0])
            .add(28, 'days')
            .format('dddd, MMMM DD, YYYY')}
        </div>
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vaos-appts__block-label">
          Pfizer
        </h2>
        <div>
          Return for your second dose after{' '}
          {moment(date1[0])
            .add(21, 'days')
            .format('dddd, MMMM DD, YYYY')}
        </div>
      </div>
      <div className="vads-u-margin-y--4">
        <AdditionalInfo triggerText="Can I choose which vaccine I will get?">
          <p>
            Not at this time. For the next several months, we won’t have enough
            vaccines to allow you to choose which vaccine you’d like to receive.
            We will reassess as more vaccines become available.
          </p>
          <p>
            Both authorized vaccines require 2 doses to work. And you must get
            the same vaccine for both doses. To help ensure this, each VA health
            facility that offers COVID-19 vaccines will receive either the
            Pfizer or the Moderna vaccine. You’ll need to get both doses at the
            same facility.
          </p>
        </AdditionalInfo>
      </div>
      <FormButtons
        pageChangeInProgress={pageChangeInProgress}
        onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
        onSubmit={() => {
          routeToNextAppointmentPage(history, pageKey);
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return getReviewPage(state);
}

const mapDispatchToProps = {
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecondDosePage);
