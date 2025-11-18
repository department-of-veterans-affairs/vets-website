import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

const institutionDetailsMock = [
  {
    institutionName: 'test',
    facilityCode: '12345678',
    isForeignCountry: false,
    institutionAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
  },
  {
    institutionName: 'test',
    facilityCode: '12345678',
    isForeignCountry: true,
    institutionAddress: {
      street: '123 Main St',
    },
  },
];

export default function transform(formConfig, form) {
  const authorizedOfficialTransform = formData => {
    const clonedData = cloneDeep(formData);

    clonedData.authorizedOfficial = formData.authorizedOfficial;

    // verify phone number transform -- international vs us phone number -- concat callingCode and contact?
    clonedData.authorizedOfficial.phoneNumber =
      clonedData.authorizedOfficial.phoneNumber.contact;

    return clonedData;
  };

  const agreementTypeTransform = formData => {
    const clonedData = cloneDeep(formData);

    clonedData.agreementType = formData.agreementType;

    return clonedData;
  };

  const acknowledgementsTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (
      formData.agreementType === 'startNewOpenEndedAgreement' ||
      formData.agreementType === 'modifyExistingAgreement'
    ) {
      clonedData.yellowRibbonProgramTerms.firstAcknowledgement = true;
      clonedData.yellowRibbonProgramTerms.secondAcknowledgement = true;
      clonedData.yellowRibbonProgramTerms.thirdAcknowledgement = true;
      clonedData.yellowRibbonProgramTerms.fourthAcknowledgement = true;
      clonedData.yellowRibbonProgramTerms.agreementCheckbox = true;
    } else {
      delete clonedData.statement1Initial;
      delete clonedData.statement2Initial;
      delete clonedData.statement3Initial;
      delete clonedData.statement4Initial;
      delete clonedData.agreementCheckbox;
    }
    return clonedData;
  };

  // Mock institution details
  const institutionDetailsTransform = formData => {
    const clonedData = cloneDeep(formData);

    clonedData.institutionDetails = institutionDetailsMock;

    // // verify path
    // clonedData.institutionDetails = [formData.institutionDetails, ...formData.additionalInstitutionDetails];

    return clonedData;
  };

  const yellowRibbonProgramRequestTransform = formData => {
    const clonedData = cloneDeep(formData);

    clonedData.yellowRibbonProgramAgreementRequest = formData.yellowRibbonProgramRequest.map(
      request => {
        const yearRange = request.academicYearDisplay.split('-');
        request.yearRange = {
          from: `${yearRange[0]}-XX-XX`,
          to: `${yearRange[1]}-XX-XX`,
        };

        delete request.academicYearDisplay;

        // eligibleIndividuals
        // maximumNumberofStudents
        // degreeLevel
        // currencyType
        // maximumContributionAmount

        return request;
      },
    );

    delete clonedData.yellowRibbonProgramRequest;

    return clonedData;
  };

  const pointOfContactTransform = formData => {
    const clonedData = cloneDeep(formData);

    const roles = {
      YellowRibbonProgramPOC:
        clonedData.pointsOfContact.roles.isYellowRibbonProgramPointOfContact,
      schoolCertifyingOfficial:
        clonedData.pointsOfContact.roles.isSchoolCertifyingOfficial,
      schoolFinancialRepresentative:
        clonedData.pointsOfContact.roles.isSchoolFinancialRepresentative,
    };

    clonedData.pointOfContact = formData.pointsOfContact;

    // verify phone number transform -- international vs us phone number -- concat callingCode and contact?
    clonedData.pointOfContact.phoneNumber =
      clonedData.pointsOfContact.phoneNumber.contact;

    clonedData.pointOfContact.emailAddress = clonedData.pointsOfContact.email;
    delete clonedData.pointOfContact.email;

    clonedData.pointOfContact.role = Object.keys(roles).filter(
      role => roles[role] === true,
    )[0];

    delete clonedData.pointOfContact.email;
    delete clonedData.pointOfContact.roles;

    if (
      Object.values(formData.additionalPointsOfContact.fullName).every(
        value => !value,
      ) === false
    ) {
      clonedData.pointOfContactTwo = formData.additionalPointsOfContact;

      // verify phone number transform -- international vs us phone number -- concat callingCode and contact?
      clonedData.pointOfContactTwo.phoneNumber =
        clonedData.additionalPointsOfContact.phoneNumber.contact;

      clonedData.pointOfContactTwo.emailAddress =
        clonedData.additionalPointsOfContact.email;

      if (
        clonedData.pointOfContact.role === 'YellowRibbonProgramPOC' ||
        clonedData.pointOfContact.role === 'schoolFinancialRepresentative'
      ) {
        clonedData.pointOfContactTwo.role = 'schoolCertifyingOfficial';
      } else {
        clonedData.pointOfContactTwo.role = 'YellowRibbonProgramPOC';
      }

      delete clonedData.pointOfContactTwo.email;
      delete clonedData.pointOfContactTwo.roles;
    }

    delete clonedData.pointsOfContact;
    delete clonedData.additionalPointsOfContact;

    return clonedData;
  };

  // Remove statement of truth field
  const statementTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.statementOfTruthCertified;

    return clonedData;
  };

  // Set *dateSigned* field to today's date
  const dateTransform = formData => {
    const clonedData = cloneDeep(formData);

    const date = new Date();
    const offset = date.getTimezoneOffset();
    const today = new Date(date.getTime() - offset * 60 * 1000);
    const [todaysDate] = today.toISOString().split('T');
    clonedData.dateSigned = todaysDate;
    return clonedData;
  };

  // Stringifies the form data and removes empty fields
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    authorizedOfficialTransform,
    agreementTypeTransform,
    acknowledgementsTransform,
    institutionDetailsTransform,
    yellowRibbonProgramRequestTransform,
    pointOfContactTransform,
    statementTransform,
    dateTransform,
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => {
    // console.log('formData', formData);
    return transformer(formData);
  }, form.data);

  // console.log('transformedData', transformedData);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
