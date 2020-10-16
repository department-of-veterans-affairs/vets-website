import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getBookingNoteFromAppointment } from '../../utils';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

const ReasonForVisitDescriptionField = props => {
  const { onReviewPage, reviewMode } = props.formContext;
  const { onChange, appointment, thing } = props;
  const currentValue = props.value;
  useEffect(
    () => {
      // if no value
      if (!currentValue) {
        // check if the incoming state
        const bookingNote = getBookingNoteFromAppointment(appointment);
        if (bookingNote) {
          // if incoming state has value, use that and set the value
          onChange(bookingNote.description);
        }
      }
    },
    [onChange, currentValue, appointment, thing],
  );

  const editField = () => {
    return (
      <div data-testid="editField">
        <TextWidget {...props} />
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
