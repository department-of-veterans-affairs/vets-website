import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  ACCREDITATION_TYPE_ENUM,
  PHONE_TYPE_ENUM,
  SERVICE_BRANCH_ENUM,
  DISCHARGE_TYPE_ENUM,
  EMPLOYMENT_STATUS_ENUM,
  DEGREE_TYPE_ENUM,
  ADMITTANCE_TYPE_ENUM,
} from './enums';
// Map form data to match 21A-schema.json structure before submitting

// need to verify the accuracy of these ENUM
const RELATIONSHIP_ENUM = {
  friend: 1,
  coworker: 2,
  employer: 3,
  teacher: 4,
  other: 5,
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
    birthAddressLine3: null, // v5 field - not currently setting this field
    birthCity: data.placeOfBirth?.city,
    birthState: data.placeOfBirth?.state,
    birthPostalCode: null, // v5 field - not currently setting this field
    birthCountry: data.placeOfBirth?.country,

    // Chapter 1 - Contact Info
    homePhone: `${data.phone.callingCode}${data.phone.contact}`,
    homePhoneTypeId: PHONE_TYPE_ENUM[data.typeOfPhone?.toUpperCase()],
    canReceiveTexts: !!data.canReceiveTexts,
    homeEmail: data.email,

    // Chapter 1 - Home Address
    homeAddressIsMilitary: !!data.homeAddress?.view?.militaryBaseDescription,
    homeAddressLine1: data.homeAddress?.street,
    homeAddressLine2: data.homeAddress?.street2 || null,
    homeAddressLine3: null, // v5 field - not currently setting this field
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
    otherAddressLine3: null, // v5 field - not currently setting this field
    otherAddressCity: data.otherAddress?.city || null,
    otherAddressState: data.otherAddress?.state || null,
    otherAddressPostalCode: data.otherAddress?.postalCode || null,
    otherAddressCountry: data.otherAddress?.country || null,

    // Chapter 2 - Military Service
    servedInMilitary: !!data.view?.isAVeteran,

    // Chapter 2 - Military Service: Branch and Dates
    militaryServices:
      data.militaryServiceExperiences?.map(m => ({
        serviceBranchId: SERVICE_BRANCH_ENUM[m.branch],
        serviceBranchExplanation: null, // v5 field - not currently setting this field
        entryDate: m.dateRange?.from || null,
        // Not using `currentlyServing` so if it exists we set `dischargeDate` to null
        dischargeDate:
          !!m.currentlyServing && m.dateRange?.to ? m.dateRange?.to : null,
        dischargeTypeId: DISCHARGE_TYPE_ENUM[m.characterOfDischarge] || null,
        dischargeTypeExplanation: m.explanationOfDischarge || null,
      })) || [],

    // Chapter 3 - Employment Status
    employmentStatusId: EMPLOYMENT_STATUS_ENUM[data.employmentStatus],

    // Chapter 3 - Employment Status Description
    employmentStatusExplaination: data.describeEmployment || null,

    // Chapter 3 - Employers Info, Address, Phone, Date Range
    employment:
      data.employers?.map(e => ({
        employerName: e.name,
        positionTitle: e.positionTitle,
        supervisorName: e.supervisorName,
        supervisorEmail: null, // v5 field - not currently setting this field
        addressIsMilitary: !!e.address?.view?.militaryBaseDescription,
        addressLine1: e.address?.street || null,
        addressLine2: e.address?.street2 || null,
        addressLine3: null, // v5 field - not currently setting this field
        addressCity: e.address?.city || null,
        addressState: e.address?.state || null,
        addressPostalCode: e.address?.postalCode || null,
        addressCountry: e.address?.country || null,
        phoneTypeId: PHONE_TYPE_ENUM.WORK,
        phoneNumber: e.phone,
        phoneExtension: null,
        startDate: e.dateRange?.from,
        // Not using `currentlyEmployed` so if it exists we set `endDate` to null
        endDate:
          !!e.currentlyEmployed && e.dateRange?.to ? e.dateRange?.to : null,
      })) || [],

    // Chapter 3 - Employment Activities
    advertisingToVeterans: data.employmentActivities.BUSINESS || false,
    consultingService: data.employmentActivities.CONSULTING || false,
    financialPlanning: data.employmentActivities.FINANCIAL || false,
    homeNursingCare: data.employmentActivities.HOME_OR_NURSING || false,
    medicalServices: data.employmentActivities.MEDICAL || false,
    // v4 field, gclaws is adding this field on 7/14
    // socialServices: data.employmentActivities.SOCIAL_WORK || false,
    // v4 field, gclaws is adding this field on 7/14
    // vocaltionalRehabilitation:
    //   data.employmentActivities.VOCATIONAL_REHABILITATION || false,

    // Chapter 4 - Education Institution and Degree Information
    education:
      data.educationalInstitutions?.map(e => ({
        name: e.name,
        startDate: e.dateRange?.from,
        endDate: e.dateRange?.to || null,
        wasDegreeReceived: !!e.degreeReceived,
        major: e.major,
        degreeTypeId: DEGREE_TYPE_ENUM[e.degree],
        addressIsMilitary: !!e.address?.view?.militaryBaseDescription,
        addressLine1: e.address?.street || null,
        addressLine2: e.address?.street2 || null,
        addressLine3: null, // v5 field - not currently setting this field
        addressCity: e.address?.city || null,
        addressState: e.address?.state || null,
        addressPostalCode: e.address?.postalCode || null,
        addressCountry: e.address?.country || null,
        institutionTypeId: null, // v5 field - not currently setting this field
      })) || [],

    // Chapter 5 - Jurisdictions and Summary
    hasJurisdiction: !!data.view?.hasJurisdictions, // This field exists but not on gclaws swagger docs
    jurisdictions:
      data.jurisdictions?.map(j => ({
        name: j.jurisdiction, // will be renamed to admittedName
        jurisdiction: j.otherJurisdiction || null, // will be renamed to admittedNotes
        admittanceTypeId: ADMITTANCE_TYPE_ENUM.JURISDICTION,
        admissionDate: j.admissionDate,
        membershipRegistrationNumber: j.membershipOrRegistrationNumber,
      })) || [],
    jurisdictionExplanation: null, // v5 field - not currently setting this field
    // jurisdictionUploadedAllDocuments: false, // v5 field - not currently setting this field
    // jurisdictionDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 5 - Agencies and Courts Summary
    admittedToPracticeAgency: !!data.view?.hasAgenciesOrCourts,
    agencies:
      data.agenciesOrCourts?.map(a => ({
        name: a.agencyOrCourt, // will be renamed to admittedName
        jurisdiction: a.otherAgencyOrCourt || null, // will be renamed to admittedNotes
        admittanceTypeId: ADMITTANCE_TYPE_ENUM.AGENCY,
        admissionDate: a.admissionDate,
        membershipRegistrationNumber: a.membershipOrRegistrationNumber,
      })) || [],
    agenciesExplanation: null, // v5 field - not currently setting this field
    // agenciesUploadedAllDocuments: false, // v5 field - not currently setting this field
    // agenciesDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

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

    // Accreditation Info
    supplementalStatement: data.supplementalStatement || null,
    personalStatement: data.personalStatement || null,
    signature: data.statementOfTruthSignature || null,
    genderId: null,
    instructionAcknowledge: !!data.statementOfTruthCertified,

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
