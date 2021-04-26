import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import moment from 'moment';
import { getReviewPage, selectPageChangeInProgress } from '../redux/selectors';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';

const pageKey = 'secondDosePage';
const pageTitle = 'When to expect a second dose';

export default function SecondDosePage() {
  const { data, facility } = useSelector(
    state => getReviewPage(state, pageKey),
    shallowEqual,
  );
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const history = useHistory();
  const dispatch = useDispatch();
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
          You’ll need to return to the {facility.name} after the dates below,
          depending on which vaccine you receive:
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
      </div>
      <FormButtons
        pageChangeInProgress={pageChangeInProgress}
        onBack={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        onSubmit={() => dispatch(routeToNextAppointmentPage(history, pageKey))}
      />
    </div>
  );
}
