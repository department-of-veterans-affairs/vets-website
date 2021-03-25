import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mockLocations } from '../../actions/mockData';

export const LocationFinder = props => {
  console.log(props.locations);
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
      <fieldset className="fieldset-input vads-u-margin-top--0">
        {mockLocations.map((location, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`location-${index}`}
              value={location.name}
            />
            <label name="undefined-0-label" htmlFor="default-0">
              <p className="vads-u-padding-left--4 vads-u-margin-top--neg3">
                {location.name}
              </p>
              <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">
                {location.street}
              </p>
              <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">{`${
                location.city
              } ${location.state}, ${location.zip}`}</p>
            </label>
          </div>
        ))}
      </fieldset>
    </>
  );
};

const mapStateToProps = store => ({
  locations: store,
});

const ReduxWrapped = connect(mapStateToProps)(LocationFinder);

class CategorySelectWrapper extends Component {
  render() {
    return <ReduxWrapped {...this.props} />;
  }
}

export default CategorySelectWrapper;
