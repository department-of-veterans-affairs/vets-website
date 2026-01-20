import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const authorizedOfficialTransform = formData => {
    const clonedData = cloneDeep(formData);

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
        firstAcknowledgement: formData.statement1Initial,
        secondAcknowledgement: formData.statement2Initial,
        thirdAcknowledgement: formData.statement3Initial,
        fourthAcknowledgement: formData.statement4Initial,
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

  const yellowRibbonProgramRequestTransform = formData => {
    const clonedData = cloneDeep(formData);
    let yearRange;

    clonedData.yellowRibbonProgramAgreementRequest = formData.yellowRibbonProgramRequest.map(
      (request, idx) => {
        if (idx === 0) {
          yearRange = request.academicYearDisplay
            ? request.academicYearDisplay.split('-')
            : request.academicYear.split('-');
        }

        request.yearRange = {
          from: `${yearRange[0]}-XX-XX`,
          to: `${yearRange[1]}-XX-XX`,
        };

        const maximumNumberOfStudents =
          request.maximumStudentsOption === 'unlimited'
            ? 99999
            : Number(request.maximumStudents);
        request.maximumNumberofStudents = maximumNumberOfStudents;

        const maximumContributionAmount =
          request.maximumContributionAmount === 'unlimited'
            ? 99999
            : Number(request.specificContributionAmount);
        request.maximumContributionAmount = maximumContributionAmount;

        // check for isUsaSchool on main institutionDetails
        request.currencyType = !clonedData.institutionDetails.isUsaSchool
          ? request.schoolCurrency
          : 'USD';

        request.degreeProgram = request.collegeOrProfessionalSchool;

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

  const institutionDetailsTransform = formData => {
    const clonedData = cloneDeep(formData);

    const clearValues = ({
      facilityMap: _facilityMap,
      ihlEligible: _ihlEligible,
      yrEligible: _yrEligible,
      isLoading: _isLoading,
      isUsaSchool: _isUsaSchool,
      isForeignSchool: _isForeignSchool,
      ...rest
    }) => rest;

    if (formData.agreementType === 'withdrawFromYellowRibbonProgram') {
      if (clonedData.additionalInstitutionDetails?.length > 0) {
        clonedData.withdrawFromYellowRibbonProgram = [
          clonedData.institutionDetails,
          ...clonedData.additionalInstitutionDetails,
        ].map(clearValues);
      } else {
        clonedData.withdrawFromYellowRibbonProgram = [
          clonedData.institutionDetails,
        ].map(clearValues);
      }

      delete clonedData.institutionDetails;
    } else if (clonedData.additionalInstitutionDetails?.length > 0) {
      clonedData.institutionDetails = [
        clonedData.institutionDetails,
        ...clonedData.additionalInstitutionDetails,
      ].map(clearValues);
    } else {
      clonedData.institutionDetails = [clonedData.institutionDetails].map(
        clearValues,
      );
    }

    delete clonedData.hasAdditionalInstitutionDetails;
    delete clonedData.additionalInstitutionDetails;

    return clonedData;
  };

  const pointOfContactTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.pointsOfContact && clonedData.pointsOfContact.fullName) {
      clonedData.pointOfContact = formData.pointsOfContact;

      const roles = {
        YellowRibbonProgramPOC:
          clonedData.pointsOfContact.roles.isYellowRibbonProgramPointOfContact,
        schoolCertifyingOfficial:
          clonedData.pointsOfContact.roles.isSchoolCertifyingOfficial,
        schoolFinancialRepresentative:
          clonedData.pointsOfContact.roles.isSchoolFinancialRepresentative,
      };

      const pointOfContactRole = Object.keys(roles).filter(
        role => roles[role] === true,
      );

      clonedData.pointOfContact.phoneNumber =
        clonedData.pointsOfContact.phoneNumber.callingCode +
        clonedData.pointsOfContact.phoneNumber.contact;

      clonedData.pointOfContact.emailAddress = clonedData.pointsOfContact.email;

      if (
        pointOfContactRole.includes('YellowRibbonProgramPOC') ||
        pointOfContactRole.includes('schoolFinancialRepresentative')
      ) {
        clonedData.pointOfContact.role = 'YellowRibbonProgramPOC';

        if (pointOfContactRole.includes('schoolCertifyingOfficial')) {
          clonedData.pointOfContactTwo = clonedData.pointsOfContact;

          clonedData.pointOfContactTwo.role = 'schoolCertifyingOfficial';

          clonedData.pointOfContactTwo.phoneNumber =
            clonedData.pointsOfContact.phoneNumber.callingCode +
            clonedData.pointsOfContact.phoneNumber.contact;

          clonedData.pointOfContactTwo.emailAddress =
            clonedData.pointsOfContact.email;

          delete clonedData.pointOfContactTwo.email;
          delete clonedData.pointOfContactTwo.roles;
        }
      }

      delete clonedData.pointOfContact.email;
      delete clonedData.pointOfContact.roles;

      if (
        formData.additionalPointsOfContact &&
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
          pointOfContactRole.includes('YellowRibbonProgramPOC') ||
          pointOfContactRole.includes('schoolFinancialRepresentative')
        ) {
          clonedData.pointOfContact.role = 'YellowRibbonProgramPOC';
          clonedData.pointOfContactTwo.role = 'schoolCertifyingOfficial';
        } else if (pointOfContactRole.includes('schoolCertifyingOfficial')) {
          clonedData.pointOfContact.role = 'schoolCertifyingOfficial';
          clonedData.pointOfContactTwo.role = 'YellowRibbonProgramPOC';
        }

        delete clonedData.pointOfContactTwo.email;
        delete clonedData.pointOfContactTwo.roles;
      }

      delete clonedData.pointsOfContact;
      delete clonedData.additionalPointsOfContact;

      return clonedData;
    }
    return clonedData;
  };

  const statementTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.statementOfTruthCertified;

    return clonedData;
  };

  const dateTransform = formData => {
    const clonedData = cloneDeep(formData);

    const date = new Date();
    const offset = date.getTimezoneOffset();
    const today = new Date(date.getTime() - offset * 60 * 1000);
    const [todaysDate] = today.toISOString().split('T');
    clonedData.dateSigned = todaysDate;
    return clonedData;
  };

  const usFormTransform = formData =>
    transformForSubmit(
      formConfig,
      { ...form, data: formData },
      { allowPartialAddress: true },
    );

  const transformedData = [
    authorizedOfficialTransform,
    agreementTypeTransform,
    acknowledgementsTransform,
    yellowRibbonProgramRequestTransform,
    institutionDetailsTransform,
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
