/**
 * The Challenge:
 * Logged out view allows a veteran to fill out name, dob, ssn, and va file number.
 * Logged in view pulls data from the profile to populate a view only component with name, dob, and gender.
 *
 * The Implications
 * There needs to be a flexible schema that can support a logged out flow where we collect personal information
 * but also allows for the limited information we pull from the profile if they are logged in.
 *
 * There needs to be a mechanism that toggles between these two states (logged in/out).
 * We need to connect to the store in this component.
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import set from 'platform/utilities/data/set';
import { VeteranInformationViewComponent } from '../components/VeteranInformationViewComponent';
//   const [veteran, setVeteran] = useState({});
//   useEffect(
//     () => {
//       setVeteran(props.user);
//     },
//     [props.user],
//   );

const VeteranInformation = props => {
  const {
    user,
    formData,
    registry,
    schema,
    uiSchema,
    onBlur,
    errorSchema,
  } = props;
  const onPropertyChange = name => {
    return value => {
      props.onChange(set(name, value, props.formData));
    };
  };
  const SchemaField = registry?.fields.SchemaField;

  return (
    <>
      {user?.login?.currentlyLoggedIn &&
      user?.profile?.verified &&
      user?.profile.status === 'OK' ? (
        <VeteranInformationViewComponent {...user.profile} />
      ) : (
        // TODO: SchemaForm can't be used as a child of a parent form...have
        //   to handwrite inputs it seems.
        // <h3>User Not logged in</h3>
        <div>
          <SchemaField
            name="fullName"
            required
            schema={props.schema.properties.fullName}
            uiSchema={props.uiSchema.fullName}
            formData={formData.fullName}
            registry={registry}
            idSchema={props.idSchema.fullName}
            onBlur={props.onBlur}
            onChange={onPropertyChange('fullName')}
            errorSchema={props.errorSchema.fullName}
          />
          <SchemaField
            name="ssn"
            required
            schema={props.schema.properties.ssn}
            uiSchema={props.uiSchema.ssn}
            formData={formData.ssn}
            registry={registry}
            idSchema={props.idSchema.ssn}
            onBlur={props.onBlur}
            onChange={onPropertyChange('ssn')}
            errorSchema={props.errorSchema.ssn}
          />
          <SchemaField
            name="VAFileNumber"
            required
            schema={props.schema.properties.VAFileNumber}
            uiSchema={props.uiSchema.VAFileNumber}
            formData={formData.VAFileNumber}
            registry={registry}
            idSchema={props.idSchema.VAFileNumber}
            onBlur={props.onBlur}
            onChange={onPropertyChange('VAFileNumber')}
            errorSchema={props.errorSchema.VAFileNumber}
          />
          <SchemaField
            name="dob"
            required
            schema={props.schema.properties.dob}
            uiSchema={props.uiSchema.dob}
            formData={formData.dob}
            registry={registry}
            idSchema={props.idSchema.dob}
            onBlur={props.onBlur}
            onChange={onPropertyChange('dob')}
            errorSchema={props.errorSchema.dob}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(VeteranInformation);
