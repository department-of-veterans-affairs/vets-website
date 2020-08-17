/**
It might be worthwhile to just detect if we're on the review page here, instead of in the VeteranInformationViewComponent.
This way, we can use hideHeaderRow in the formConfig, and just rebuild the review field using formContext.
 */
import React from 'react';
import { connect } from 'react-redux';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import { VeteranInformationViewComponent } from '../components/VeteranInformationViewComponent';

const VeteranInformation = props => {
  const { user, formData, registry, formContext } = props;
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
        <VeteranInformationViewComponent
          profile={user.profile}
          formData={formData}
          formContext={formContext}
          setData={props.setData}
          reviewPageView={props.reviewPageView}
        />
      ) : (
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
  reviewPageView: state.form.reviewPageView.openChapters,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranInformation);
