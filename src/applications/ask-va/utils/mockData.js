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

export const mockInquiryDataBusinessAndPersonal = {
  data: [
    {
      id: '1',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20240917-306466',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '9/17/24',
        createdOn: '9/17/24',
        status: 'In Progress',
        submitterQuestion:
          'I received approval for a claim for dependency on September 2, 2024. After that I received the increase in the monthly allowance, but I have yet to receive the back pay owed. Any idea on when that will be paid?',
        schoolFacilityCode: '0123',
        categoryName: 'Disability compensation',
        topic: 'Claim status',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Sept. 17, 2024 at 2:32 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'I received approval for a claim for dependency on September 2, 2024. After that I received the increase in the monthly allowance, but I have yet to receive the back pay owed. Any idea on when that will be paid?',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '2',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20240824-306412',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '9/12/24',
        createdOn: '8/24/24',
        status: 'Reopened',
        submitterQuestion:
          "How do I go about getting my spouse a VA card, since I'm a Veteran and I already have mine?",
        schoolFacilityCode: '0123',
        categoryName: 'Veteran ID Card (VIC)',
        topic:
          'Veteran Health Identification Card (VHIC) for health appointments',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Aug. 24, 2024 at 1:14 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  "How do I go about getting my spouse a VA card, since I'm a Veteran and I already have mine?",
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'Sept. 2, 2024 at 9:08 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Thank you for your inquiry. The Digital Veterans ID Card (VIC) is currently only available to Veterans. For information on benefits and services available to family members, please visit www.va.gov.',
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e108',
              modifiedOn: 'Sept. 12, 2024 at 11:04 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your reply to VA',
              enableReply: true,
              attributes: {
                reply:
                  'Does that mean at some point it will be available for spouses of Veterans?',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '3',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20240304-301312',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '3/8/24',
        createdOn: '3/4/24',
        status: 'Replied',
        submitterQuestion:
          'How can I view my dependents information? I cannot see them on my end on the VA website. I have three dependents.',
        schoolFacilityCode: '0123',
        categoryName: 'Sign in and technical issues',
        topic: 'Technical issues on VA.gov',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Mar. 24, 2024 at 11:20 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'How can I view my dependents information? I cannot see them on my end on the VA website. I have three dependents.',
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'Mar. 8, 2024 at 9:32 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'I apologize for the inconvenience. The VA is reporting that it is aware of an issue where Veterans’ profiles are populating without dependents. We are currently researching the common cause.  We have verified that your dependents are on your award(spouse and two children).If you require specific letters that detail this information, please contact us at 800-698 - 2411 while we make corrections to VA.gov.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '4',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20231106-300239',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '11/14/23',
        createdOn: '11/6/23',
        status: 'Replied',
        submitterQuestion:
          'When I click on benefits in the VA app and then check on a current claim status, the app shuts down. I didn’t have this issue a week ago. I can navigate through the entire app with no issues except claim status. Can someone help?',
        schoolFacilityCode: '0123',
        categoryName: 'Sign in and technical issues',
        topic: 'Technical issues on VA.gov',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Nov. 6, 2024 at 3:20 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'When I click on benefits in the VA app and then check on a current claim status, the app shuts down. I didn’t have this issue a week ago. I can navigate through the entire app with no issues except claim status. Can someone help?',
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'Nov. 14, 2024 at 10:24 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Your claims are currently in the decision phase of processing. We apologize for the error. Some claim types are not visible in our claims tracker at each stage of processing. If not further information or evidence is needed, a decision will be made and you will be notified in writing.\n\nWe understand it may seem like it’s taking a while. We assure you, we are working to complete your claim as quickly as possible. Please understand that the time your claim takes to complete is complete based on the specifics of your claim and VA’s pending workload. For a detailed status, or for escalation options, we recommend you contacting your assigned VA Regional Office. You can find their contact information here:\nhttps://www.va.gov/DIRECTORY/GUIDE/home.asp.\n\nRespectfully,\n\nVeterans Benefits Administration\n\nThe Insignia Team, EVSS',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '5',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20230424-300125',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '5/2/23',
        createdOn: '4/24/23',
        status: 'Replied',
        submitterQuestion:
          "I'm trying to get my COE for a VA Loan. Could your office assist with this? Thank you.",
        schoolFacilityCode: '0123',
        categoryName: 'Housing assistance and home loans',
        topic: 'Technical issues on VA.gov',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Apr. 24, 2023 at 10:22 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  "I'm trying to get my COE for a VA Loan. Could your office assist with this? Thank you.",
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'May. 2, 2023 at 11.47 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Hello. Here are some ways to get a COE: VA Portal: You order a COE using the VA portal if you have access to the LGYHub. Call or text: You can request a COE by calling 988 and pressing 1, or texting 838255. Visit a VA location: You can visit a medical center or regional office. Work with a mortgage originator: You can work with a mortgage originator to get a COE.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '6',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'B-20240918-406567',
        attachments: ['contract_review.pdf'],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '9/18/24',
        createdOn: '9/18/24',
        status: 'In Progress',
        submitterQuestion:
          'We have received confirmation of a claim for an employee’s compensation adjustment on September 3, 2024. Could you provide details on when the retroactive payments will be issued?',
        schoolFacilityCode: '0456',
        categoryName: 'Compensation and benefits',
        topic: 'Retroactive payment inquiry',
        veteranRelationship: 'employee',
        reply: {
          data: [
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e206',
              modifiedOn: 'Sept. 18, 2024 at 3:15 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'We have received confirmation of a claim for an employee’s compensation adjustment on September 3, 2024. Could you provide details on when the retroactive payments will be issued?',
                attachmentNames: ['contract_review.pdf'],
              },
            },
          ],
        },
      },
    },
    {
      id: '7',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'B-20240825-406513',
        attachments: ['request_info.pdf'],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '9/13/24',
        createdOn: '8/25/24',
        status: 'Reopened',
        submitterQuestion:
          'Is there a process to apply for VA benefits for dependents of veterans within our organization? We are looking for more information to support spouses of Veterans.',
        schoolFacilityCode: '0456',
        categoryName: 'Employee benefits',
        topic: 'Veteran family benefits',
        veteranRelationship: 'dependent',
        reply: {
          data: [
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e207',
              modifiedOn: 'Aug. 25, 2024 at 4:20 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'Is there a process to apply for VA benefits for dependents of veterans within our organization? We are looking for more information to support spouses of Veterans.',
                attachmentNames: ['request_info.pdf'],
              },
            },
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e208',
              modifiedOn: 'Sept. 2, 2024 at 9:35 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Thank you for your inquiry. Currently, benefits for spouses of Veterans are not available. We encourage you to check back for any changes in policy.',
                attachmentNames: [],
              },
            },
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e209',
              modifiedOn: 'Sept. 13, 2024 at 11:15 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your reply to VA',
              enableReply: true,
              attributes: {
                reply:
                  'Understood. Please keep us updated if this policy changes in the future.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '8',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'B-20240305-401315',
        attachments: ['employee_info.pdf'],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '3/10/24',
        createdOn: '3/5/24',
        status: 'Replied',
        submitterQuestion:
          'We are unable to view our employees’ dependent information on the VA website. Could you assist us in resolving this issue?',
        schoolFacilityCode: '0456',
        categoryName: 'Technical support',
        topic: 'Dependent information access',
        veteranRelationship: 'employee',
        reply: {
          data: [
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e210',
              modifiedOn: 'Mar. 5, 2024 at 9:00 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'We are unable to view our employees’ dependent information on the VA website. Could you assist us in resolving this issue?',
                attachmentNames: ['employee_info.pdf'],
              },
            },
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e211',
              modifiedOn: 'Mar. 10, 2024 at 1:30 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Thank you for reaching out. There is a known issue with the VA system regarding dependent information. We are working on a resolution and will update you as soon as it is fixed.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '9',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'B-20231107-401240',
        attachments: ['error_log.pdf'],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '11/15/23',
        createdOn: '11/7/23',
        status: 'Replied',
        submitterQuestion:
          'Our organization has experienced app crashes when trying to access claim statuses for employees. Can you assist in resolving this technical issue?',
        schoolFacilityCode: '0456',
        categoryName: 'Technical support',
        topic: 'App crashes on claim status',
        veteranRelationship: 'admin',
        reply: {
          data: [
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e212',
              modifiedOn: 'Nov. 7, 2023 at 11:10 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'Our organization has experienced app crashes when trying to access claim statuses for employees. Can you assist in resolving this technical issue?',
                attachmentNames: ['error_log.pdf'],
              },
            },
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e213',
              modifiedOn: 'Nov. 15, 2023 at 10:50 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'We are aware of the app crashes affecting claim status checks. Our technical team is investigating the issue, and we will provide updates once resolved.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '10',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'B-20230425-401130',
        attachments: ['loan_info.pdf'],
        correspondences: null,
        hasAttachments: true,
        hasBeenSplit: true,
        levelOfAuthentication: 'Business',
        lastUpdate: '5/3/23',
        createdOn: '4/25/23',
        status: 'Replied',
        submitterQuestion:
          'Could you provide assistance with obtaining a Certificate of Eligibility (COE) for our employee’s VA loan?',
        schoolFacilityCode: '0456',
        categoryName: 'Housing and home loans',
        topic: 'COE request for employees',
        veteranRelationship: 'employer',
        reply: {
          data: [
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e214',
              modifiedOn: 'Apr. 25, 2023 at 10:00 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'Could you provide assistance with obtaining a Certificate of Eligibility (COE) for our employee’s VA loan?',
                attachmentNames: ['loan_info.pdf'],
              },
            },
            {
              id: 'b2c4af2b-ec8c-ee11-8178-001dd804e215',
              modifiedOn: 'May. 3, 2023 at 12:40 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'We recommend that your employee request a COE directly through the VA portal or through their mortgage provider.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
  ],
};

export const mockInquiryData = {
  data: [
    {
      id: '1',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20240917-306466',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '9/17/24',
        createdOn: '9/17/24',
        status: 'In Progress',
        submitterQuestion:
          'I received approval for a claim for dependency on September 2, 2024. After that I received the increase in the monthly allowance, but I have yet to receive the back pay owed. Any idea on when that will be paid?',
        schoolFacilityCode: '0123',
        categoryName: 'Disability compensation',
        topic: 'Claim status',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Sept. 17, 2024 at 2:32 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'I received approval for a claim for dependency on September 2, 2024. After that I received the increase in the monthly allowance, but I have yet to receive the back pay owed. Any idea on when that will be paid?',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '2',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20240824-306412',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '9/12/24',
        createdOn: '8/24/24',
        status: 'Reopened',
        submitterQuestion:
          "How do I go about getting my spouse a VA card, since I'm a Veteran and I already have mine?",
        schoolFacilityCode: '0123',
        categoryName: 'Veteran ID Card (VIC)',
        topic:
          'Veteran Health Identification Card (VHIC) for health appointments',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Aug. 24, 2024 at 1:14 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  "How do I go about getting my spouse a VA card, since I'm a Veteran and I already have mine?",
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'Sept. 2, 2024 at 9:08 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Thank you for your inquiry. The Digital Veterans ID Card (VIC) is currently only available to Veterans. For information on benefits and services available to family members, please visit www.va.gov.',
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e108',
              modifiedOn: 'Sept. 12, 2024 at 11:04 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your reply to VA',
              enableReply: true,
              attributes: {
                reply:
                  'Does that mean at some point it will be available for spouses of Veterans?',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '3',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20240304-301312',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '3/8/24',
        createdOn: '3/4/24',
        status: 'Replied',
        submitterQuestion:
          'How can I view my dependents information? I cannot see them on my end on the VA website. I have three dependents.',
        schoolFacilityCode: '0123',
        categoryName: 'Sign in and technical issues',
        topic: 'Technical issues on VA.gov',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Mar. 24, 2024 at 11:20 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'How can I view my dependents information? I cannot see them on my end on the VA website. I have three dependents.',
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'Mar. 8, 2024 at 9:32 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'I apologize for the inconvenience. The VA is reporting that it is aware of an issue where Veterans’ profiles are populating without dependents. We are currently researching the common cause.  We have verified that your dependents are on your award(spouse and two children).If you require specific letters that detail this information, please contact us at 800-698 - 2411 while we make corrections to VA.gov.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '4',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20231106-300239',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '11/14/23',
        createdOn: '11/6/23',
        status: 'Replied',
        submitterQuestion:
          'When I click on benefits in the VA app and then check on a current claim status, the app shuts down. I didn’t have this issue a week ago. I can navigate through the entire app with no issues except claim status. Can someone help?',
        schoolFacilityCode: '0123',
        categoryName: 'Sign in and technical issues',
        topic: 'Technical issues on VA.gov',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Nov. 6, 2024 at 3:20 p.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  'When I click on benefits in the VA app and then check on a current claim status, the app shuts down. I didn’t have this issue a week ago. I can navigate through the entire app with no issues except claim status. Can someone help?',
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'Nov. 14, 2024 at 10:24 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Your claims are currently in the decision phase of processing. We apologize for the error. Some claim types are not visible in our claims tracker at each stage of processing. If not further information or evidence is needed, a decision will be made and you will be notified in writing.\n\nWe understand it may seem like it’s taking a while. We assure you, we are working to complete your claim as quickly as possible. Please understand that the time your claim takes to complete is complete based on the specifics of your claim and VA’s pending workload. For a detailed status, or for escalation options, we recommend you contacting your assigned VA Regional Office. You can find their contact information here:\nhttps://www.va.gov/DIRECTORY/GUIDE/home.asp.\n\nRespectfully,\n\nVeterans Benefits Administration\n\nThe Insignia Team, EVSS',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
    {
      id: '5',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20230424-300125',
        attachments: [],
        correspondences: null,
        hasAttachments: false,
        hasBeenSplit: true,
        levelOfAuthentication: 'Personal',
        lastUpdate: '5/2/23',
        createdOn: '4/24/23',
        status: 'Replied',
        submitterQuestion:
          "I'm trying to get my COE for a VA Loan. Could your office assist with this? Thank you.",
        schoolFacilityCode: '0123',
        categoryName: 'Housing assistance and home loans',
        topic: 'Technical issues on VA.gov',
        veteranRelationship: 'self',
        reply: {
          data: [
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e106',
              modifiedOn: 'Apr. 24, 2023 at 10:22 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Your question',
              enableReply: true,
              attributes: {
                reply:
                  "I'm trying to get my COE for a VA Loan. Could your office assist with this? Thank you.",
                attachmentNames: [],
              },
            },
            {
              id: 'a6c3af1b-ec8c-ee11-8178-001dd804e107',
              modifiedOn: 'May. 2, 2023 at 11.47 a.m. E.T.',
              statusReason: 'Completed/Sent',
              messageType: '722310001: Response from VA',
              enableReply: true,
              attributes: {
                reply:
                  'Hello. Here are some ways to get a COE: VA Portal: You order a COE using the VA portal if you have access to the LGYHub. Call or text: You can request a COE by calling 988 and pressing 1, or texting 838255. Visit a VA location: You can visit a medical center or regional office. Work with a mortgage originator: You can work with a mortgage originator to get a COE.',
                attachmentNames: [],
              },
            },
          ],
        },
      },
    },
  ],
};
