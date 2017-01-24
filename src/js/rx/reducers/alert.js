import React from 'react';
import { Link } from 'react-router';
import ErrorMessages from '../components/ErrorMessages';

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
      const rx = action.prescription;

      return {
        content: (
          <div>
            <b>
              Could not request a refill for <Link to={`/${rx.prescriptionId}`}>
              {rx.prescriptionName}</Link>.
            </b>
            <ErrorMessages errors={action.errors}/>
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
