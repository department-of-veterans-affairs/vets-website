import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

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
      clonedData.yellowRibbonProgramTerms = {
        firstAcknowledgement: 'yes',
        secondAcknowledgement: 'yes',
        thirdAcknowledgement: 'yes',
        fourthAcknowledgement: 'yes',
        agreeToProvideYellowRibbonProgramContributions: true,
      };
    }

    delete clonedData.statement1Initial;
    delete clonedData.statement2Initial;
    delete clonedData.statement3Initial;
    delete clonedData.statement4Initial;
    delete clonedData.agreementCheckbox;

    return clonedData;
  };

  const institutionDetailsTransform = formData => {
    const clonedData = cloneDeep(formData);

    // TODO: verify transform with live institution data
    if (formData.agreementType === 'withdrawFromYellowRibbonProgram') {
      clonedData.withdrawFromYellowRibbonProgram = [
        clonedData.institutionDetails,
        ...clonedData.additionalInstitutionDetails,
      ];
    } else {
      clonedData.institutionDetails = [
        clonedData.institutionDetails,
        ...clonedData.additionalInstitutionDetails,
      ];
    }

    delete clonedData.additionalInstitutionDetails;

    return clonedData;
  };

  const yellowRibbonProgramRequestTransform = formData => {
    const clonedData = cloneDeep(formData);

    // TODO: verify logic with live institutionDetails (depends on foreign status)
    clonedData.yellowRibbonProgramAgreementRequest = formData.yellowRibbonProgramRequest.map(
      request => {
        const yearRange = request.academicYearDisplay.split('-');
        request.yearRange = {
          from: `${yearRange[0]}-XX-XX`,
          to: `${yearRange[1]}-XX-XX`,
        };

        const maximumNumberOfStudents =
          request.maximumStudentsOption === 'unlimited'
            ? 1000000
            : Number(request.maximumStudents);
        request.maximumNumberOfStudents = maximumNumberOfStudents;

        const maximumContributionAmount =
          request.maximumContributionAmount === 'unlimited'
            ? 99999
            : Number(request.specificContributionAmount);
        request.maximumContributionAmount = maximumContributionAmount;

        request.currencyType = request.schoolCurrency;

        request.degreeProgram = request.collegeOrProfessionalSchool;

        // TODO: verify logic around degreeLevel transform
        // -- how to handle something other than undergraduate, graduate, or doctoral? No validation in UI
        if (
          request.degreeLevel !== 'undergraduate' ||
          request.degreeLevel !== 'graduate' ||
          request.degreeLevel !== 'doctoral'
        ) {
          request.degreeLevel = 'all';
        }

        // TODO: verify eligibleIndividuals field, where is this coming from?
        // -- putting as max amount for now
        request.eligibleIndividuals = 1000000;

        delete request.academicYearDisplay;
        delete request.maximumStudentsOption;
        delete request.maximumStudents;
        delete request.specificContributionAmount;
        delete request.schoolCurrency;
        delete request.collegeOrProfessionalSchool;

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

    clonedData.pointOfContact.phoneNumber =
      clonedData.pointsOfContact.phoneNumber.callingCode +
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

      clonedData.pointOfContactTwo.phoneNumber =
        clonedData.additionalPointsOfContact.phoneNumber.callingCode +
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
    return transformer(formData);
  }, form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
