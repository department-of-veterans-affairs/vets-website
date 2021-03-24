import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import TextAreaWidget from '@department-of-veterans-affairs/react-jsonschema-form/lib/components/widgets/TextareaWidget';

import { selectCurrentAppointment } from '../../../shared/redux-selectors';
import { appointmentSelector } from '../../../shared/utils/selectors';

const ReasonForVisitDescriptionField = props => {
  const { onReviewPage, reviewMode } = props.formContext;
  const { onChange, appointment } = props;
  const currentValue = props.value;
  const [hasOnChangeBeenRun, setHasOnChangeBeenRun] = useState(false);
  useEffect(
    () => {
      const updateCurrentValue = () => {
        // Only try to use the booking note there is not a current value.
        if (!currentValue) {
          // check to see if the current appointment has a booking note,
          // not all appointments have them
          const bookingNote = appointmentSelector.getBookingNote(appointment);
          if (bookingNote) {
            onChange(bookingNote.description);
            setHasOnChangeBeenRun(true);
          }
        }
      };
      if (!hasOnChangeBeenRun) {
        updateCurrentValue();
      }
    },
    [onChange, currentValue, appointment, hasOnChangeBeenRun],
  );

  const editField = () => {
    return (
      <div data-testid="editField">
        <TextAreaWidget {...props} />
      </div>
    );
  };

  if (onReviewPage && reviewMode) {
    return <>{currentValue}</>;
  } else if (onReviewPage && !reviewMode) {
    return editField();
  } else {
    return editField();
  }
};

const mapStateToProps = state => ({
  appointment: selectCurrentAppointment(state),
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitDescriptionField);
