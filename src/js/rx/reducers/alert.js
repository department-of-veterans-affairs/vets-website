import React from 'react';
import { Link } from 'react-router';

const initialState = {
  content: '',
  status: 'info',
  visible: false
};

export default function alert(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_ALERT':
      return {
        content: action.content,
        status: action.status,
        visible: true
      };

    case 'CLOSE_ALERT':
      return initialState;

    case 'REFILL_FAILURE': {
      return {
        content: (
          <div>
            <h5 className="va-alert-title">Prescription refill unsuccessful</h5>
            <p>We couldn't process this request. Please try again or <a href="/healthcare/messaging">message your provider</a>.</p>
          </div>
        ),
        status: 'error',
        visible: true
      };
    }

    case 'REFILL_SUCCESS': {
      const rx = action.prescription;

      return {
        content: (
          <b>
            Refill for <Link to={`/${rx.prescriptionId}`}>
            {rx.prescriptionName}</Link> has been requested.
          </b>
        ),
        status: 'success',
        visible: true
      };
    }

    default:
      return state;
  }
}
