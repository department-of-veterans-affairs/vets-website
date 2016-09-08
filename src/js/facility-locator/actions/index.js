export function fetchVAFacility(id) {
  return {
    type: 'FETCH_VA_FACILITY',
    payload: {
      id,
      name: 'National Capital Region Benefits Office, Specially Adapted Housing Office',
      facilityType: 'facility',
      address: {
        street1: '1722 I Street, NW',
        street2: '',
        city: 'Washington',
        state: 'DC',
        zip: '20005'
      },
      cemetary: {
        cemetaryType: 'National',
        operations: 'closed'
      },
      phone: {
        main: '202-530-9010',
        pharmacy: '202-530-9372',
        afterHours: '202-530-9373',
        enrollmentCoordinator: '202-530-9405',
        fax: '202-530-9046',
        patientAdvocate: '202-530-9047'
      },
      monday: '800am-430pm',
      tuesday: '800am-430pm',
      wednesday: '800am-430pm',
      thursday: '800am-430pm',
      friday: '800am-430pm',
      saturday: '-',
      sunday: '-',
      longitude: '-89.86923039',
      latitude: '38.54265307',
      Audiology: 'NO',
      ComplementaryAlternativeMed: 'NO',
      DentalServices: 'NO',
      DiagnosticServices: 'NO',
      ImagingAndRadiology: 'NO',
      LabServices: 'NO',
      EmergencyDept: 'NO',
      EyeCare: 'NO',
      MentalHealthCare: 'NO',
      OutpatientMHCare: 'NO',
      OutpatientSpecMHCare: 'NO',
      VocationalAssistance: 'NO',
      OutpatientMedicalSpecialty: 'NO',
      AllergyAndImmunology: 'NO',
      CardiologyCareServices: 'NO',
      DermatologyCareServices: 'NO',
      Diabetes: 'NO',
      Dialysis: 'NO',
      Endocrinology: 'NO',
      Gastroenterology: 'NO',
      Hematology: 'NO',
      InfectiousDisease: 'NO',
      InternalMedicine: 'NO',
      Nephrology: 'NO',
      Neurology: 'NO',
      Oncology: 'NO',
      PulmonaryRespiratoryDisease: 'NO',
      Rheumatology: 'NO',
      SleepMedicine: 'NO',
      OutpatientSurgicalSpecialty: 'NO',
      CardiacSurgery: 'NO',
      ColoRectalSurgery: 'NO',
      ENT: 'NO',
      GeneralSurgery: 'NO',
      Gynecology: 'NO',
      Neurosurgery: 'NO',
      Orthopedics: 'NO',
      PainManagement: 'NO',
      PlasticSurgery: 'NO',
      Podiatry: 'NO',
      ThoracicSurgery: 'NO',
      Urology: 'NO',
      VascularSurgery: 'NO',
      PrimaryCare: 'NO',
      Rehabilitation: 'NO',
      UrgentCare: 'NO',
      WellnessAndPreventativeCare: 'NO'
    }
  };
}

export function fetchVAFacilities() {
  return {
    type: 'FETCH_VA_FACILITY',
    payload: [
      {
        name: 'VA Facility One',
        coord: [38.89767, -77.0365]
      },
      {
        name: 'VA Facility Two',
        coord: [38.89769, -77.0369]
      }
    ]
  };
}
