import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { ACCREDITATION_TYPE_ENUM, PHONE_TYPE_ENUM } from './enums';
// Map form data to match 21A-schema.json structure before submitting

// need to verify the accuracy of these ENUM
const RELATIONSHIP_ENUM = {
  friend: 1,
  coworker: 2,
  employer: 3,
  teacher: 4,
  other: 5,
};

const DEGREE_ENUM = {
  'High School Diploma': 1,
  'Associate degree': 2,
  "Bachelor's degree": 3,
  "Master's degree": 4,
  'Doctoral degree': 5,
  Other: 6,
};

const build21aPayload = data => {
  return {
    // Chapter 1 - Role
    accreditationTypeId: ACCREDITATION_TYPE_ENUM[data.role],

    // Chapter 1 - Law License
    isInGoodStanding: data.lawLicense,

    // Chapter 1 - Name and DOB
    firstName: data.fullName?.first,
    middleName: data.fullName?.middle || null,
    lastName: data.fullName?.last,
    suffix: data.fullName?.suffix || null,
    birthDate: data.dateOfBirth,

    // Chapter 1 - Place of Birth
    birthAddressLine1: null,
    birthAddressLine2: null,
    birthAddressLine3: null,
    birthCity: data.placeOfBirth?.city,
    birthState: data.placeOfBirth?.state,
    birthPostalCode: null,
    birthCountry: data.placeOfBirth?.country,

    // Chapter 1 - Contact Info
    homePhone: data.phone,
    homePhoneTypeId: PHONE_TYPE_ENUM[data.typeOfPhone?.toUpperCase()],
    canReceiveTexts: !!data.canReceiveTexts,
    homeEmail: data.email,

    // Chapter 1 - Home Address
    homeAddressIsMilitary: !!data.homeAddress?.view?.militaryBaseDescription,
    homeAddressLine1: data.homeAddress?.street,
    homeAddressLine2: data.homeAddress?.street2 || null,
    homeAddressLine3: null,
    homeAddressCity: data.homeAddress?.city,
    homeAddressState: data.homeAddress?.state,
    homeAddressPostalCode: data.homeAddress?.postalCode,
    homeAddressCountry: data.homeAddress?.country,

    // Chapter 1 - Primary Mailing Address
    primaryMailingAddress: data.primaryMailingAddress,

    // Chapter 1 - Other Addresses
    otherAddressIsMilitary: !!data.otherAddress?.view?.militaryBaseDescription,
    otherAddressLine1: data.otherAddress?.street || null,
    otherAddressLine2: data.otherAddress?.street2 || null,
    otherAddressLine3: null,
    otherAddressCity: data.otherAddress?.city || null,
    otherAddressState: data.otherAddress?.state || null,
    otherAddressPostalCode: data.otherAddress?.postalCode || null,
    otherAddressCountry: data.otherAddress?.country || null,

    // Chapter 2 - Military Service
    servedInMilitary: !!data.view?.isAVeteran,

    // Chapter 2 - Military Service: Branch and Dates
    militaryServices:
      data.militaryServiceExperiences?.map(m => ({
        serviceBranchId: m.branch,
        serviceBranchExplanation: null,
        entryDate: m.dateRange?.from || null,
        dischargeDate: m.dateRange?.to || null,
        dischargeTypeId: m.characterOfDischarge || null,
        dischargeTypeExplanation: m.explanationOfDischarge || null,
      })) || [],
    // Accreditation Info

    supplementalStatement: data.supplementalStatement || null,
    personalStatement: data.personalStatement || null,
    signature: data.statementOfTruthSignature || null,
    genderId: null,
    instructionAcknowledge: !!data.statementOfTruthCertified,

    // Employment Info
    employmentStatusId: data.employmentStatus || null,
    employmentStatusExplaination: data.describeEmployment || null,
    employment:
      data.employers?.map(e => ({
        employerName: e.name || null,
        addressIsMilitary: !!e.address?.view?.militaryBaseDescription,
        addressLine1: e.address?.street || null,
        addressLine2: e.address?.street2 || null,
        addressLine3: null,
        addressCity: e.address?.city || null,
        addressState: e.address?.state || null,
        addressPostalCode: e.address?.postalCode || null,
        addressCountry: e.address?.country || null,
        phoneNumber: e.phone || null,
        phoneExtension: null,
        phoneTypeId: null,
        positionTitle: e.positionTitle || null,
        startDate: e.dateRange?.from || null,
        endDate: e.dateRange?.to || null,
        supervisorName: e.supervisorName || null,
        supervisorEmail: null,
      })) || [],

    // Education Info
    education:
      data.educationalInstitutions?.map(e => ({
        name: e.name || null,
        addressIsMilitary: !!e.address?.view?.militaryBaseDescription,
        addressLine1: e.address?.street || null,
        addressLine2: e.address?.street2 || null,
        addressLine3: null,
        addressCity: e.address?.city || null,
        addressState: e.address?.state || null,
        addressPostalCode: e.address?.postalCode || null,
        addressCountry: e.address?.country || null,
        institutionTypeId: null,
        startDate: e.dateRange?.from || null,
        endDate: e.dateRange?.to || null,
        wasDegreeReceived: !!e.degreeReceived,
        degreeTypeId: DEGREE_ENUM[e.degree] || null,
        major: e.major || null,
      })) || [],

    // Character References
    characterReferences:
      data.characterReferences?.map(r => ({
        firstName: r.fullName?.first || null,
        middleName: r.fullName?.middle || null,
        lastName: r.fullName?.last || null,
        suffix: r.fullName?.suffix || null,
        addressIsMilitary: !!r.address?.view?.militaryBaseDescription,
        addressLine1: r.address?.street || null,
        addressLine2: r.address?.street2 || null,
        addressLine3: null,
        addressCity: r.address?.city || null,
        addressState: r.address?.state || null,
        addressPostalCode: r.address?.postalCode || null,
        addressCountry: r.address?.country || null,
        phoneNumber: r.phone || null,
        phoneExtension: null,
        phoneTypeId: null,
        email: r.email || null,
        relationshipToApplicantTypeId:
          RELATIONSHIP_ENUM[r.relationship?.toLowerCase()] || null,
      })) || [],

    advertisingToVeterans: data.advertisingToVeterans || false,
    consultingService: data.consultingService || false,
    financialPlanning: data.financialPlanning || false,
    funeralIndustry: data.funeralIndustry || false,
    homeNursingCare: data.homeNursingCare || false,
    medicalServices: data.medicalServices || false,
    // Licensing / Jurisdictions
    jurisdictions:
      data.jurisdictions?.map(j => ({
        jurisdiction: j.jurisdiction,
        name: j.otherJurisdiction,
        admittanceTypeId: j.admittanceTypeId,
        admissionDate: j.admissionDate,
        membershipRegistrationNumber: j.membershipOrRegistrationNumber,
      })) || [],
    jurisdictionExplanation: data.jurisdictions?.[0]?.jurisdiction || null,
    jurisdictionUploadedAllDocuments: null,
    jurisdictionDeclinedToUploadDocuments: null,

    // Agencies
    admittedToPracticeAgency: !!data.representativeForAgency,
    agencies:
      data.agenciesOrCourts?.map(a => ({
        name: a.agencyOrCourt || a.otherAgencyOrCourt,
        admittanceTypeId: a.admittanceTypeId,
        admissionDate: a.admissionDate,
        membershipRegistrationNumber: a.membershipOrRegistrationNumber,
      })) || [],
    agenciesExplanation: data.agenciesOrCourts?.[0]?.agencyOrCourt || null,
    agenciesUploadedAllDocuments: null,
    agenciesDeclinedToUploadDocuments: null,

    // Background & Disclosures
    wasImprisoned: !!data.conviction,
    imprisonedExplanation: !!data.hasConviction,
    imprisonedUploadedAllDocuments: null,
    imprisonedDeclinedToUploadDocuments: null,

    wasMilitaryConviction: !!data.courtMartialed,
    militaryConvictionExplanation: null,
    militaryConvictionUploadedAllDocuments: null,
    militaryConvictionDeclinedToUploadDocuments: null,

    isCurrentlyCharged: !!data.underCharges,
    currentlyChargedExplanation: null,
    currentlyChargedUploadedAllDocuments: null,
    currentlyChargedDeclinedToUploadDocuments: null,

    wasSuspended: !!data.disciplinedForDishonesty,
    suspendedExplanation: null,
    suspendedUploadedAllDocuments: null,
    suspendedDeclinedToUploadDocuments: null,

    hasWithdrawn: !!data.withdrawnFromEducation,
    withdrawnExplanation: null,
    withdrawnUploadedAllDocuments: null,
    withdrawnDeclinedToUploadDocuments: null,

    wasDisciplined: !!data.reprimandedInAgency,
    disciplinedExplanation: null,
    disciplinedUploadedAllDocuments: null,
    disciplinedDeclinedToUploadDocuments: null,

    hasResignedRetired: !!data.resignedFromEducation,
    resignedRetiredExplanation: null,
    resignedRetiredUploadedAllDocuments: null,
    resignedRetiredDeclinedToUploadDocuments: null,

    wasAgentAttorney: !!data.representativeForAgency,
    agentAttorneyExplanation: null,
    agentAttorneyUploadedAllDocuments: null,
    agentAttorneyDeclinedToUploadDocuments: null,

    wasReprimanded: !!data.resignedFromAgency,
    reprimandedExplanation: null,
    reprimandedUploadedAllDocuments: null,
    reprimandedDeclinedToUploadDocuments: null,

    hasResignedToAvoidReprimand: null,
    resignedToAvoidReprimandExplanation: null,
    resignedToAvoidReprimandUploadedAllDocuments: null,
    resignedToAvoidReprimandDeclinedToUploadDocuments: null,

    hasAppliedForAccreditation: !!data.appliedForVaAccreditation,
    appliedForAccreditationExplanation: null,
    appliedForAccreditationUploadedAllDocuments: null,
    appliedForAccreditationDeclinedToUploadDocuments: null,

    wasAccreditationTerminated: !!data.terminatedByVsorg,
    accreditationTerminatedExplanation: null,
    accreditationTerminatedUploadedAllDocuments: null,
    accreditationTerminatedDeclinedToUploadDocuments: null,

    hasImpairments: !!data.conditionThatAffectsRepresentation,
    impairmentsExplanation: null,
    impairmentsUploadedAllDocuments: null,
    impairmentsDeclinedToUploadDocuments: null,

    hasPhysicalLimitations: null,
    physicalLimitationsExplanation: null,
    physicalLimitationsUploadedAllDocuments: null,
    physicalLimitationsDeclinedToUploadDocuments: null,

    // Unique Identifiers
    icnNo: null,
    uId: null,
  };
};

export default function submitTransformer(formConfig, form) {
  const transformedData = build21aPayload(form.data);
  const submission = transformForSubmit(formConfig, {
    ...form,
    data: transformedData,
  });

  return JSON.stringify({
    form21aSubmission: {
      form: submission,
    },
  });
}
