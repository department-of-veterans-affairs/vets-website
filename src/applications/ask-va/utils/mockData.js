export const healthFacilityMockData = {
  data: [
    {
      id: 'vba_349b',
      type: 'facility',
      attributes: {
        classification: 'Satellite Office',
        distance: 13.98,
        facilityType: 'va_benefits_facility',
        id: 'vba_349b',
        lat: 30.205656,
        long: -97.6903515,
        mobile: null,
        name: 'VA Regional Benefit Satellite Office at Austin VA Clinic',
        operationalHoursSpecialInstructions: null,
        uniqueId: '349b',
        visn: null,
        website: 'https://www.benefits.va.gov/waco/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78744',
            city: 'Austin',
            state: 'TX',
            address1: '7901 Metropolis Drive',
            address2: 'Rooms 1G-104, 1G-105, and 1G-106',
          },
        },
        feedback: [],
        hours: {
          monday: '8:30 a.m. - 4:00 p.m.',
          tuesday: '8:30 a.m. - 4:00 p.m.',
          wednesday: '8:30 a.m. - 4:00 p.m.',
          thursday: '8:30 a.m. - 4:00 p.m.',
          friday: '8:30 a.m. - 4:00 p.m.',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          main: '800-827-1000',
        },
        services: {
          benefits: [
            {
              name: 'ApplyingForBenefits',
              serviceId: 'applyingForBenefits',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/applyingForBenefits',
            },
            {
              name: 'BurialClaimAssistance',
              serviceId: 'burialClaimAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/burialClaimAssistance',
            },
            {
              name: 'DisabilityClaimAssistance',
              serviceId: 'disabilityClaimAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/disabilityClaimAssistance',
            },
            {
              name: 'eBenefitsRegistrationAssistance',
              serviceId: 'eBenefitsRegistrationAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/eBenefitsRegistrationAssistance',
            },
            {
              name: 'FamilyMemberClaimAssistance',
              serviceId: 'familyMemberClaimAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/familyMemberClaimAssistance',
            },
            {
              name: 'HomelessAssistance',
              serviceId: 'homelessAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/homelessAssistance',
            },
            {
              name: 'UpdatingDirectDepositInformation',
              serviceId: 'updatingDirectDepositInformation',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services/updatingDirectDepositInformation',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349b/services',
        },
      },
    },
    {
      id: 'vha_674BY',
      type: 'facility',
      attributes: {
        classification: 'Multi-Specialty CBOC',
        distance: 13.98,
        facilityType: 'va_health_facility',
        id: 'vha_674BY',
        lat: 30.205656,
        long: -97.6903515,
        mobile: false,
        name: 'Austin VA Clinic',
        operationalHoursSpecialInstructions: null,
        uniqueId: '674BY',
        visn: '17',
        website:
          'https://www.va.gov/central-texas-health-care/locations/austin-va-clinic/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78744-3111',
            city: 'Austin',
            state: 'TX',
            address1: '7901 Metropolis Drive',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: '0.49000000953674316',
            primaryCareRoutine: 0.800000011920929,
          },
          effectiveDate: '2024-02-08',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          fax: '512-823-4125',
          main: '800-423-2111',
          pharmacy: '800-423-2111',
          afterHours: '800-423-2111',
          patientAdvocate: '254-743-0586',
          mentalHealthClinic: '512-823-4040',
          enrollmentCoordinator: '254-743-2420',
          healthConnect: '1-800-423-2111',
        },
        services: {
          health: [
            {
              name: 'Amputation care',
              serviceId: 'amputation',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/amputation',
            },
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/audiology',
            },
            {
              name: 'Cardiology',
              serviceId: 'cardiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/cardiology',
            },
            {
              name: 'Chiropractic',
              serviceId: 'chiropractic',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/chiropractic',
            },
            {
              name: 'COVID-19 vaccines',
              serviceId: 'covid19Vaccine',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/covid19Vaccine',
            },
            {
              name: 'Dental/oral surgery',
              serviceId: 'dental',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/dental',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/dermatology',
            },
            {
              name: 'Gastroenterology',
              serviceId: 'gastroenterology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/gastroenterology',
            },
            {
              name: 'Gynecology',
              serviceId: 'gynecology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/gynecology',
            },
            {
              name: 'Hematology/oncology',
              serviceId: 'hematology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/hematology',
            },
            {
              name: 'Homeless Veteran care',
              serviceId: 'homeless',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/homeless',
            },
            {
              name: 'Mental health care',
              serviceId: 'mentalHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/mentalHealth',
            },
            {
              name: 'Nutrition, food, and dietary care',
              serviceId: 'nutrition',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/nutrition',
            },
            {
              name: 'Ophthalmology',
              serviceId: 'ophthalmology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/ophthalmology',
            },
            {
              name: 'Optometry',
              serviceId: 'optometry',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/optometry',
            },
            {
              name: 'Orthopedics',
              serviceId: 'orthopedics',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/orthopedics',
            },
            {
              name: 'Otolaryngology',
              serviceId: 'otolaryngology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/otolaryngology',
            },
            {
              name: 'Pain management',
              serviceId: 'painManagement',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/painManagement',
            },
            {
              name: 'Patient advocates',
              serviceId: 'patientAdvocates',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/patientAdvocates',
            },
            {
              name: 'Physical medicine and rehabilitation',
              serviceId: 'physicalMedicine',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/physicalMedicine',
            },
            {
              name: 'Physical therapy, occupational therapy and kinesiotherapy',
              serviceId: 'physicalTherapy',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/physicalTherapy',
            },
            {
              name: 'Podiatry',
              serviceId: 'podiatry',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/podiatry',
            },
            {
              name: 'Primary care',
              serviceId: 'primaryCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/primaryCare',
            },
            {
              name: 'Prosthetics and rehabilitation',
              serviceId: 'prosthetics',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/prosthetics',
            },
            {
              name: 'Radiology',
              serviceId: 'radiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/radiology',
            },
            {
              name: 'Recreation and creative arts therapy',
              serviceId: 'recreationTherapy',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/recreationTherapy',
            },
            {
              name: 'Social work',
              serviceId: 'socialWork',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/socialWork',
            },
            {
              name: 'Suicide prevention',
              serviceId: 'suicidePrevention',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/suicidePrevention',
            },
            {
              name: 'Toxic exposure screening',
              serviceId: 'toxicExposureScreening',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/toxicExposureScreening',
            },
            {
              name: 'Returning service member care',
              serviceId: 'transitionCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/transitionCounseling',
            },
            {
              name: 'Urology',
              serviceId: 'urology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/urology',
            },
            {
              name: 'Women Veteran care',
              serviceId: 'womensHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services/womensHealth',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674BY/services',
          lastUpdated: '2024-08-05',
        },
      },
    },
    {
      id: 'vc_0703V',
      type: 'facility',
      attributes: {
        classification: null,
        distance: 17.76,
        facilityType: 'vet_center',
        id: 'vc_0703V',
        lat: 30.243105,
        long: -97.736859,
        mobile: false,
        name: 'Austin Vet Center',
        operationalHoursSpecialInstructions: null,
        uniqueId: '0703V',
        visn: '17',
        website: 'https://www.va.gov/austin-vet-center/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78704',
            city: 'Austin',
            state: 'TX',
            address1: '1524 South IH 35',
            address2: 'Suite 100',
          },
        },
        feedback: [],
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          fax: '512-416-7019',
          main: '512-416-1314',
        },
        services: {
          health: [
            {
              name: 'Addiction and substance use care',
              serviceId: 'addiction',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/addiction',
            },
            {
              name: 'Community engagement',
              serviceId: 'communityEngagement',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/communityEngagement',
            },
            {
              name: 'Couples and family counseling',
              serviceId: 'familyCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/familyCounseling',
            },
            {
              name: 'Grief and bereavement counseling',
              serviceId: 'griefCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/griefCounseling',
            },
            {
              name: 'Homeless Veteran care',
              serviceId: 'homeless',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/homeless',
            },
            {
              name: 'Military sexual trauma care',
              serviceId: 'militarySexualTrauma',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/militarySexualTrauma',
            },
            {
              name: 'PTSD care',
              serviceId: 'ptsd',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/ptsd',
            },
            {
              name: 'Suicide prevention',
              serviceId: 'suicidePrevention',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/suicidePrevention',
            },
            {
              name: 'Telehealth',
              serviceId: 'telehealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/telehealth',
            },
            {
              name: 'Returning service member care',
              serviceId: 'transitionCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/transitionCounseling',
            },
            {
              name: 'Veteran connections',
              serviceId: 'veteranConnections',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/veteranConnections',
            },
            {
              name: 'Whole health',
              serviceId: 'wholeHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/wholeHealth',
            },
            {
              name: 'Women Veteran care',
              serviceId: 'womensHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/womensHealth',
            },
            {
              name: 'Workshops and classes',
              serviceId: 'workshops',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services/workshops',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vc_0703V/services',
        },
      },
    },
    {
      id: 'nca_s1118',
      type: 'facility',
      attributes: {
        classification: 'State Cemetery',
        distance: 18.18,
        facilityType: 'va_cemetery',
        id: 'nca_s1118',
        lat: 30.19813,
        long: -97.77675,
        mobile: null,
        name: 'State Veterans Cemeteries Texas Veterans Land Board',
        operationalHoursSpecialInstructions: null,
        uniqueId: 's1118',
        visn: null,
        website: 'https://vlb.texas.gov/cemeteries/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78701',
            city: 'Austin',
            state: 'TX',
            address1: '1700 N. Congress Avenue, Room 840A',
          },
        },
        feedback: [],
        hours: {
          monday: 'Sunrise - Sunset',
          tuesday: 'Sunrise - Sunset',
          wednesday: 'Sunrise - Sunset',
          thursday: 'Sunrise - Sunset',
          friday: 'Sunrise - Sunset',
          saturday: 'Sunrise - Sunset',
          sunday: 'Sunrise - Sunset',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          main: '800-252-8387',
        },
        services: [],
      },
    },
    {
      id: 'vba_349n',
      type: 'facility',
      attributes: {
        classification: 'VetSuccess On Campus',
        distance: 20.84,
        facilityType: 'va_benefits_facility',
        id: 'vba_349n',
        lat: 30.3263229,
        long: -97.7126619,
        mobile: null,
        name:
          'VetSuccess on Campus at Austin Community College Highland Campus',
        operationalHoursSpecialInstructions: null,
        uniqueId: '349n',
        visn: null,
        website: null,
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78752',
            city: 'Austin',
            state: 'TX',
            address1: '6101 Highland Campus Dr',
            address2: 'Bldg 4000',
          },
        },
        feedback: [],
        hours: {
          monday: '8:00 a.m. - 4:00 p.m.',
          tuesday: '8:00 a.m. - 4:00 p.m.',
          wednesday: '8:00 a.m. - 4:00 p.m.',
          thursday: '8:00 a.m. - 4:00 p.m.',
          friday: '8:00 a.m. - 4:00 p.m.',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          main: '512-223-7041',
        },
        services: {
          benefits: [
            {
              name: 'ApplyingForBenefits',
              serviceId: 'applyingForBenefits',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349n/services/applyingForBenefits',
            },
            {
              name: 'EducationAndCareerCounseling',
              serviceId: 'educationAndCareerCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349n/services/educationAndCareerCounseling',
            },
            {
              name: 'EducationClaimAssistance',
              serviceId: 'educationClaimAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349n/services/educationClaimAssistance',
            },
            {
              name: 'VocationalRehabilitationAndEmploymentAssistance',
              serviceId: 'vocationalRehabilitationAndEmploymentAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349n/services/vocationalRehabilitationAndEmploymentAssistance',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349n/services',
        },
      },
    },
    {
      id: 'vba_349k',
      type: 'facility',
      attributes: {
        classification: 'Veteran Readiness and Employment Office',
        distance: 28.13,
        facilityType: 'va_benefits_facility',
        id: 'vba_349k',
        lat: 30.4311956,
        long: -97.7517712,
        mobile: null,
        name: 'Austin Veteran Readiness and Employment Office',
        operationalHoursSpecialInstructions: null,
        uniqueId: '349k',
        visn: null,
        website: null,
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78759',
            city: 'Austin',
            state: 'TX',
            address1: '12515 Research Blvd',
            address2: 'Bldg 7, Suite 160',
          },
        },
        feedback: [],
        hours: {
          monday: '8:00 a.m. - 4:30 p.m.',
          tuesday: '8:00 a.m. - 4:30 p.m.',
          wednesday: '8:00 a.m. - 4:30 p.m.',
          thursday: '8:00 a.m. - 4:30 p.m.',
          friday: '8:00 a.m. - 4:30 p.m.',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          main: '512-206-0857',
        },
        services: {
          benefits: [
            {
              name: 'EducationAndCareerCounseling',
              serviceId: 'educationAndCareerCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349k/services/educationAndCareerCounseling',
            },
            {
              name: 'VocationalRehabilitationAndEmploymentAssistance',
              serviceId: 'vocationalRehabilitationAndEmploymentAssistance',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349k/services/vocationalRehabilitationAndEmploymentAssistance',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vba_349k/services',
        },
      },
    },
    {
      id: 'vha_674GD',
      type: 'facility',
      attributes: {
        classification: 'Primary Care CBOC',
        distance: 35.91,
        facilityType: 'va_health_facility',
        id: 'vha_674GD',
        lat: 30.5310884,
        long: -97.81286592,
        mobile: false,
        name: 'Cedar Park VA Clinic',
        operationalHoursSpecialInstructions: null,
        uniqueId: '674GD',
        visn: '17',
        website:
          'https://www.va.gov/central-texas-health-care/locations/cedar-park-va-clinic/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78613-2216',
            city: 'Cedar Park',
            state: 'TX',
            address1: '1401 Medical Parkway',
            address3: 'Suite 400, Building C',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: 0.5,
            primaryCareRoutine: 0.7300000190734863,
          },
          effectiveDate: '2024-02-08',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          fax: '254-743-1566',
          main: '800-423-2111',
          pharmacy: '800-423-2111',
          afterHours: '800-423-2111',
          patientAdvocate: '254-743-0586',
          mentalHealthClinic: '512-823-4040',
          enrollmentCoordinator: '254-743-2420',
          healthConnect: '1-800-423-2111',
        },
        services: {
          health: [
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/dermatology',
            },
            {
              name: 'Laboratory and pathology',
              serviceId: 'laboratory',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/laboratory',
            },
            {
              name: 'Mental health care',
              serviceId: 'mentalHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/mentalHealth',
            },
            {
              name: 'My HealtheVet coordinator',
              serviceId: 'myHealtheVetCoordinator',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/myHealtheVetCoordinator',
            },
            {
              name: 'Nutrition, food, and dietary care',
              serviceId: 'nutrition',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/nutrition',
            },
            {
              name: 'Pharmacy',
              serviceId: 'pharmacy',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/pharmacy',
            },
            {
              name: 'Primary care',
              serviceId: 'primaryCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/primaryCare',
            },
            {
              name: 'Prosthetics and rehabilitation',
              serviceId: 'prosthetics',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/prosthetics',
            },
            {
              name: 'Radiology',
              serviceId: 'radiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/radiology',
            },
            {
              name: 'Smoking and tobacco cessation',
              serviceId: 'smoking',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/smoking',
            },
            {
              name: 'Toxic exposure screening',
              serviceId: 'toxicExposureScreening',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/toxicExposureScreening',
            },
            {
              name: 'Women Veteran care',
              serviceId: 'womensHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services/womensHealth',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674GD/services',
          lastUpdated: '2024-08-05',
        },
      },
    },
    {
      id: 'vha_674HB',
      type: 'facility',
      attributes: {
        classification: 'Primary Care CBOC',
        distance: 38.87,
        facilityType: 'va_health_facility',
        id: 'vha_674HB',
        lat: 29.93610753,
        long: -96.87528,
        mobile: false,
        name: 'LaGrange VA Clinic',
        operationalHoursSpecialInstructions: null,
        uniqueId: '674HB',
        visn: '17',
        website:
          'https://www.va.gov/central-texas-health-care/locations/lagrange-va-clinic/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78945-1251',
            city: 'LaGrange',
            state: 'TX',
            address1: '2 Saint Marks Place',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: 0,
            primaryCareRoutine: 0.9800000190734863,
          },
          effectiveDate: '2024-02-08',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          fax: '254-743-1568',
          main: '800-423-2111',
          pharmacy: '254-778-4811',
          afterHours: '800-423-2111',
          patientAdvocate: '254-743-0586',
          mentalHealthClinic: '254-743-2867option3',
          enrollmentCoordinator: '254-778-4811',
          healthConnect: '1-800-423-2111',
        },
        services: {
          health: [
            {
              name: 'Laboratory and pathology',
              serviceId: 'laboratory',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/laboratory',
            },
            {
              name: 'Mental health care',
              serviceId: 'mentalHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/mentalHealth',
            },
            {
              name: 'My HealtheVet coordinator',
              serviceId: 'myHealtheVetCoordinator',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/myHealtheVetCoordinator',
            },
            {
              name: 'Pharmacy',
              serviceId: 'pharmacy',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/pharmacy',
            },
            {
              name: 'Primary care',
              serviceId: 'primaryCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/primaryCare',
            },
            {
              name: 'Radiology',
              serviceId: 'radiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/radiology',
            },
            {
              name: 'Telehealth',
              serviceId: 'telehealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/telehealth',
            },
            {
              name: 'Toxic exposure screening',
              serviceId: 'toxicExposureScreening',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services/toxicExposureScreening',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_674HB/services',
          lastUpdated: '2024-08-05',
        },
      },
    },
    {
      id: 'vha_671GL',
      type: 'facility',
      attributes: {
        classification: 'Other Outpatient Services (OOS)',
        distance: 42.06,
        facilityType: 'va_health_facility',
        id: 'vha_671GL',
        lat: 29.72015179,
        long: -98.062317,
        mobile: false,
        name: 'New Braunfels VA Clinic',
        operationalHoursSpecialInstructions: null,
        uniqueId: '671GL',
        visn: '17',
        website:
          'https://www.va.gov/south-texas-health-care/locations/new-braunfels-va-clinic/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78130-0086',
            city: 'New Braunfels',
            state: 'TX',
            address1: '790 Generations Drive',
            address3: 'Suite 700',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: 0.5099999904632568,
            primaryCareRoutine: 0.8500000238418579,
          },
          effectiveDate: '2024-02-08',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          fax: '830-629-2438',
          main: '830-643-0717',
          pharmacy: '877-469-5300 x1',
          afterHours: '888-686-6350',
          patientAdvocate: '210-949-3822',
          mentalHealthClinic: '210-949-9702',
          enrollmentCoordinator: '210-949-3981',
          healthConnect: '1-877-469-5300',
        },
        services: {
          health: [
            {
              name: 'Advice nurse',
              serviceId: 'adviceNurse',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/adviceNurse',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/dermatology',
            },
            {
              name: 'Laboratory and pathology',
              serviceId: 'laboratory',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/laboratory',
            },
            {
              name: 'Nutrition, food, and dietary care',
              serviceId: 'nutrition',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/nutrition',
            },
            {
              name: 'Orthopedics',
              serviceId: 'orthopedics',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/orthopedics',
            },
            {
              name: 'Primary care',
              serviceId: 'primaryCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/primaryCare',
            },
            {
              name: 'Social work',
              serviceId: 'socialWork',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services/socialWork',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671GL/services',
          lastUpdated: '2024-08-05',
        },
      },
    },
    {
      id: 'vha_671QD',
      type: 'facility',
      attributes: {
        classification: 'Other Outpatient Services (OOS)',
        distance: 60.54,
        facilityType: 'va_health_facility',
        id: 'vha_671QD',
        lat: 29.53532608,
        long: -98.28650153,
        mobile: false,
        name: 'San Antonio Randolph VA Clinic',
        operationalHoursSpecialInstructions: null,
        uniqueId: '671QD',
        visn: '17',
        website: null,
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '78150-4800',
            city: 'Randolph Air Force Base',
            state: 'TX',
            address1: '221 Third Street West',
          },
        },
        feedback: [],
        hours: {
          monday: '730AM-400PM',
          tuesday: '730AM-400PM',
          wednesday: '930AM-400PM',
          thursday: '730AM-400PM',
          friday: '800AM-400PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'NORMAL',
        },
        phone: {
          fax: '210-550-1880',
          main: '210-652-1846',
          pharmacy: '210-617-5300',
          afterHours: '210-617-5300',
          patientAdvocate: '210-949-3822',
          enrollmentCoordinator: '210-617-5300 x17927',
          healthConnect: '1-877-469-5300',
        },
        services: {
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_671QD/services',
          lastUpdated: '2024-08-05',
        },
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: 2,
      totalPages: 258,
      totalEntries: 2575,
    },
  },
  links: {
    self:
      'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=30.086313&long=-97.501342&page=1&per_page=10',
    first:
      'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=30.086313&long=-97.501342&per_page=10',
    prev: null,
    next:
      'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=30.086313&long=-97.501342&page=2&per_page=10',
    last:
      'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=30.086313&long=-97.501342&page=258&per_page=10',
  },
};

export const mockInquiryData = {
  data: [
    {
      id: '1',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-1',
        attachments: [
          {
            id: '1',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/20/23',
        createdOn: '11/15/23',
        status: 'New',
        submitterQuestion: 'What is my status?',
        schoolFacilityCode: '0123',
        category: 'Health care',
        topic: 'Status of a pending claim',
        veteranRelationship: 'self',
      },
    },
    {
      id: '2',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-2',
        attachments: [
          {
            id: '2',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '1/20/23',
        createdOn: '12/15/22',
        status: 'In Progress',
        submitterQuestion: 'How do I update my address?',
        schoolFacilityCode: '0123',
        category: 'Disability compensation',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '3',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-3',
        attachments: [
          {
            id: '3',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '2/20/23',
        createdOn: '1/18/23',
        status: 'Closed',
        submitterQuestion: 'How do I change my caretaker?',
        schoolFacilityCode: '0123',
        category: 'Pension',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '4',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-4',
        attachments: [
          {
            id: '4',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '3/20/23',
        createdOn: '2/25/23',
        status: 'Reopened',
        submitterQuestion: 'What is compensation?',
        schoolFacilityCode: '0123',
        category: 'Life insurance',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '5',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-5',
        attachments: [
          {
            id: '5',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '4/20/23',
        createdOn: '3/10/23',
        status: 'Archived',
        submitterQuestion:
          'How do I find more information about my compensation?',
        schoolFacilityCode: '0123',
        category: 'Center for Women Veterans',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '6',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-6',
        attachments: [
          {
            id: '6',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '5/20/23',
        createdOn: '4/15/23',
        status: 'In Progress',
        submitterQuestion: 'What is the status of my pending claim?',
        schoolFacilityCode: '0123',
        category: 'Center for Minority Veterans',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '7',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-7',
        attachments: [
          {
            id: '7',
            name: 'testfile.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '6/20/23',
        createdOn: '5/30/23',
        status: 'In Progress',
        submitterQuestion: 'What is the status of my pending claim?',
        schoolFacilityCode: '0123',
        category: 'Survivor Benefits',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '8',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-8',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '7/20/23',
        createdOn: '6/25/23',
        status: 'In Progress',
        submitterQuestion: 'What is the status of my claim?',
        schoolFacilityCode: '0123',
        category: 'Survivor Benefits',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '9',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-9',
        attachments: [
          {
            id: '8',
            name: 'part_of_inquiry_9.pdf',
          },
          {
            id: '9',
            name: 'part_of_inquiry_9.pdf',
          },
          {
            id: '10',
            name: 'part_of_inquiry_9.pdf',
          },
          {
            id: '11',
            name: 'part_of_inquiry_9.pdf',
          },
          {
            id: '14',
            name: 'txt_file_for_inquiry_9.txt',
          },
        ],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '8/20/23',
        createdOn: '7/30/23',
        status: 'In Progress',
        submitterQuestion:
          'I am inquiring about the current status of my claim, specifically regarding its processing stage, any outstanding requirements, and the estimated timeline for completion. Could you please provide a detailed update?',
        schoolFacilityCode: '0123',
        category: 'Survivor Benefits',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '10',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-10',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '9/20/23',
        createdOn: '8/10/23',
        status: 'In Progress',
        submitterQuestion:
          'I am currently exploring options to increase my compensation and would greatly appreciate detailed guidance on the process. Could you please provide the necessary steps, required documentation, and any pertinent deadlines or criteria for eligibility?',
        schoolFacilityCode: '0123',
        category: 'Survivor Benefits',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '11',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-11',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '10/20/23',
        createdOn: '9/15/23',
        status: 'In Progress',
        submitterQuestion:
          'What is the process for vets to plan for the National Cemetery?',
        schoolFacilityCode: '0123',
        category: 'Survivor Benefits',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '12',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-12',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '10/20/23',
        createdOn: '9/20/23',
        status: 'In Progress',
        submitterQuestion:
          'Where can depends find more info on Burial Benefits?',
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '13',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-13',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '10/20/23',
        createdOn: '9/25/23',
        status: 'In Progress',
        submitterQuestion:
          'What is the process for a vet to transfer their benefits to their dependents?',
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '14',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-14',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '10/20/23',
        createdOn: '9/30/23',
        status: 'In Progress',
        submitterQuestion:
          'Where can I find more informoation on Education Debt?',
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '15',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-15',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '11/20/23',
        createdOn: '10/10/23',
        status: 'In Progress',
        submitterQuestion:
          'Where can I find more informoation on Education Debt?',
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '16',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-16',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '11/20/23',
        createdOn: '10/15/23',
        status: 'In Progress',
        submitterQuestion: 'We have a major breakout! What do we do?',
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '17',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-17',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '11/20/23',
        createdOn: '10/17/23',
        status: 'In Progress',
        submitterQuestion: 'We have a major breakout! What do we do?',
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
    {
      id: '18',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-18',
        attachments: [],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '11/20/23',
        createdOn: '10/25/23',
        status: 'In Progress',
        submitterQuestion: "Is it possible to do the 'wave' across America?",
        schoolFacilityCode: '0123',
        category: 'Sign in and technical issues',
        topic: 'All other Questions',
        veteranRelationship: 'self',
      },
    },
  ],
};
