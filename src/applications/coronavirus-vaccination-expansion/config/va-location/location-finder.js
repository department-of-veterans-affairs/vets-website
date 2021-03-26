import React from 'react';
import { connect } from 'react-redux';

export const LocationFinder = () => {
  return (
    <>
      <p>
        These are the VA medical centers closest to where you live. Select one
        or more medical centers you're willing to go to get a COVID-19 vaccine.
        If you don't select any, we'll match you with the first one on the list
      </p>
      <p>
        <strong>Note</strong>: if you get a vaccine that requires 2 doses to be
        fully effective, you'll need to return to the same VA medical center to
        get your second dose.
      </p>
    </>
  );
};

const mapStateToProps = store => ({
  locations: store,
});

export default connect(mapStateToProps)(LocationFinder);
