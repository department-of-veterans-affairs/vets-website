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
          If you need a second dose, you may need to return to the{' '}
          {facility.name} after the dates below, depending on which vaccine you
          receive:
        </p>
        <p>
          If you receive your first dose on{' '}
          <strong>{moment(date1[0]).format('dddd, MMMM DD, YYYY')}</strong> and
          receive:
        </p>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
          Moderna
        </h2>
        <div>
          Requires 2 doses
          <br />
          Plan to return{' '}
          <strong>
            after{' '}
            {moment(date1[0])
              .add(28, 'days')
              .format('dddd, MMMM DD, YYYY')}
          </strong>
        </div>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">Pfizer</h2>
        <div>
          Requires 2 doses
          <br />
          Plan to return{' '}
          <strong>
            after{' '}
            {moment(date1[0])
              .add(21, 'days')
              .format('dddd, MMMM DD, YYYY')}
          </strong>
        </div>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
          Johnson & Johnson
        </h2>
        <div>1 dose only</div>
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
