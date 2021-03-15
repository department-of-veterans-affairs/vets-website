import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import moment from 'moment';
import { getReviewPage } from '../redux/selectors';

const pageKey = 'secondDosePage';
const pageTitle = 'When to expect a second dose';

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
      <div className="vads-u-margin-bottom--4">
        <p>
          If you need a second dose, you may need to return to the{' '}
          {facility.name} after the dates below, depending on which vaccine you
          receive:
        </p>
        <p>
          If you receive your first dose on{' '}
          <strong>{moment(date1[0]).format('dddd, MMMM DD, YYYY ')} </strong>
          and receive:
        </p>
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-font-weight--normal">
          Moderna
        </h2>
        <div>
          Requires 2 doses
          <br />
          <strong>
            Plan to return after{' '}
            {moment(date1[0])
              .add(28, 'days')
              .format('dddd, MMMM DD, YYYY')}
          </strong>
        </div>
        <hr aria-hidden="true" className="vads-u-margin-y--2" />
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vaos-appts__block-label  vads-u-font-weight--normal">
          Pfizer
        </h2>
        <div>
          Requires 2 doses
          <br />
          <strong>
            Plan to return after{' '}
            {moment(date1[0])
              .add(21, 'days')
              .format('dddd, MMMM DD, YYYY')}
          </strong>
        </div>
        <hr aria-hidden="true" className="vads-u-margin-y--2" />
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vaos-appts__block-label  vads-u-font-weight--normal">
          Johnson & Johnson
        </h2>
        <div>1 dose only</div>
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
