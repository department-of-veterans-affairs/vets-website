import React, { useMemo } from 'react';
import { convertRepType } from '../utilities/helpers';

export function useTransformForReview(formData) {
  const representative = formData['view:selectedRepresentative'].attributes;
  const organization = formData.selectedAccreditedOrganizationName;
  const applicantIsVeteran = formData['view:applicantIsVeteran'] === 'Yes';

  const veteran = {
    firstName: formData?.veteranFullName?.first,
    middleName: formData?.veteranFullName?.middle,
    lastName: formData?.veteranFullName?.last,
    ssn: formData.veteranSocialSecurityNumber,
    vaFileNumber: formData.veteranVAFileNumber,
    dateOfBirth: formData.veteranDateOfBirth,
    serviceNumber: formData.serviceNumber,
    serviceBranch: formData.serviceBranch,
    street: formData.veteranHomeAddress.street,
    street2: formData.veteranHomeAddress.street2,
    city: formData?.veteranHomeAddress?.city,
    state: formData?.veteranHomeAddress?.state,
    postalCode: formData?.veteranHomeAddress?.postalCode,
    phone: formData.primaryPhone,
    email: formData.veteranEmail,
  };

  const claimant = applicantIsVeteran
    ? veteran
    : {
        firstName: formData?.applicantName?.first,
        middleName: formData?.applicantName?.middle,
        lastName: formData?.applicantName?.last,
        dateOfBirth: formData?.applicantDOB || '',
        relationship: formData?.claimantRelationship || '',
        street: formData?.homeAddress?.street,
        street2: formData?.homeAddress?.street2,
        city: formData?.homeAddress?.city,
        state: formData?.homeAddress?.state,
        postalCode: formData?.homeAddress?.postalCode,
        phone: formData?.applicantPhone || '',
        email: formData?.applicantEmail || '',
      };

  const renderField = (label, value) => {
    if (!value) return null;
    return (
      <>
        <p className="light-gray">{label}</p>
        <p>{value}</p>
      </>
    );
  };

  const renderVeteranForNonVeteranClaimant = () => {
    return (
      <>
        <h3>Veteran information</h3>
        {renderField('First name', veteran.firstName)}
        {renderField('Middle name', veteran.middleName)}
        {renderField('Last name', veteran.lastName)}
        {renderField('Social security number', veteran.ssn)}
        {renderField('VA file number', veteran.vaFileNumber)}
        {renderField('Date of birth', veteran.dateOfBirth)}
        {renderField('Relationship', veteran.relationship)}

        {renderField('Primary number', veteran.phone)}
        {renderField('Email address', veteran.email)}

        <p className="light-gray">Mailing address</p>
        {veteran.street ? <p>{veteran.street}</p> : null}
        {veteran.street2 ? <p>{veteran.street2} </p> : null}
        <p>
          {veteran.city ? veteran.city : null},{' '}
          {veteran.state ? veteran.state : null}{' '}
          {veteran.postalCode ? veteran.postalCode : null}
        </p>
      </>
    );
  };

  return useMemo(
    () => {
      return (
        <>
          <h3>Accredited representative information</h3>
          {renderField('Name', representative?.fullName)}
          {renderField('Organization', organization)}
          {renderField(
            'Type',
            convertRepType(formData?.['view:selectedRepresentative']?.type),
          )}

          <p className="light-gray">Mailing address</p>
          {representative?.addressLine1 ? (
            <p>{representative.addressLine1}</p>
          ) : null}
          {representative?.addressLine2 ? (
            <p>{representative.addressLine2}</p>
          ) : null}
          {representative?.addressLine3 ? (
            <p>{representative.addressLine3}</p>
          ) : null}

          <p>
            {representative.city ? `${representative.city},` : null},{' '}
            {representative.stateCode ? `${representative.stateCode},` : null}{' '}
            {representative.zipCode ? `${representative.zipCode},` : null}
          </p>

          {renderField('Phone number', representative?.phone)}
          {renderField('Email address', representative?.email)}

          <h3>Your information</h3>
          {renderField('First name', claimant.firstName)}
          {renderField('Middle name', claimant.middleName)}
          {renderField('Last name', claimant.lastName)}
          {renderField('Social security number', claimant.ssn)}
          {renderField('VA file number', claimant.vaFileNumber)}
          {renderField('Date of birth', claimant.dateOfBirth)}
          {renderField('Relationship', claimant.relationship)}

          {renderField('Primary number', claimant.phone)}
          {renderField('Email address', claimant.email)}

          <p className="light-gray">Mailing address</p>
          {claimant.street && <p>{claimant.street}</p>}
          {claimant.street2 && <p>{claimant.street2}</p>}

          <p>
            {representative.city ? `${representative.city},` : null},{' '}
            {representative.state ? `${representative.state},` : null}{' '}
            {representative.postalCode ? `${representative.postalCode},` : null}
          </p>

          {!applicantIsVeteran && renderVeteranForNonVeteranClaimant()}

          <h3>Accredited representative authorizations</h3>
          {renderField(
            'Do you authorize this accredited VSO to access your medical records?',
            formData?.authorizationRadio,
          )}
          {renderField(
            'Do you authorize this accredited VSO Representative to change your address on VA records?',
            formData?.authorizeAddressRadio,
          )}
          {renderField(
            'Do you authorize this accredited Attorney’s team to access your records through VA’s information technology systems?',
            formData?.authorizeInsideVARadio,
          )}
          {renderField(
            'Do you authorize this accredited Attorney’s team to access your records outside VA’s information technology systems?',
            formData?.authorizeInsideVARadio,
          )}
          {renderField(
            'Enter the name of each team member who can access your records outside of VA’s information technology systems',
            formData?.authorizeNamesTextArea,
          )}
        </>
      );
    },
    [formData],
  );
}
