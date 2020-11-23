import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getBookingNoteFromAppointment } from '../../utils';
import TextAreaWidget from '@department-of-veterans-affairs/react-jsonschema-form/lib/components/widgets/TextareaWidget';

const ReasonForVisitDescriptionField = props => {
  const { onReviewPage, reviewMode } = props.formContext;
  const { onChange, appointment } = props;
  const currentValue = props.value;
  useEffect(
    () => {
      // Only try to use the booking note there is not a current value.
      if (!currentValue) {
        // check to see if the current appointment has a booking note,
        // not all appointments have them
        const bookingNote = getBookingNoteFromAppointment(appointment);
        if (bookingNote) {
          onChange(bookingNote.description);
        }
      }
    },
    [onChange, currentValue, appointment],
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
  appointment: state?.questionnaireData?.context?.appointment,
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitDescriptionField);
