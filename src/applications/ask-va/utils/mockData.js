export const mockHealthFacilityResponse = {
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

// Dashboard cards based on Wed Dec 18 for User 119
export const mockInquiries = {
  data: [
    {
      id: '251a31bd-24b7-ef11-b8e9-001dd8053a71',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241210-308771',
        attachments: null,
        categoryName: 'Health care',
        createdOn: '12/10/2024 6:29:52 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Audiology and hearing aids',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/12/2024 12:00:00 AM',
        queueId: 'f9d63862-d81f-ed11-b83c-001dd8069009',
        queueName: 'VHA Audiology',
        status: 'InProgress',
        submitterQuestion: 'testing crm staging fix',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '41851774-2ab7-ef11-b8e9-001dd8053a71',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241210-308772',
        attachments: null,
        categoryName: 'Veteran Readiness and Employment',
        createdOn: '12/10/2024 7:10:47 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Financial issues',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/12/2024 12:00:00 AM',
        queueId: '807de9d5-1b6b-eb11-b0b0-001dd8309f34',
        queueName: 'VBA Pittsburgh RO-VR&E',
        status: 'Reopened',
        submitterQuestion: 'test',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '5791b367-37b3-ef11-b8e9-001dd805523c',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241205-308673',
        attachments: null,
        categoryName: 'Benefits issues outside the U.S.',
        createdOn: '12/5/2024 6:33:24 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Disability compensation',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/12/2024 12:00:00 AM',
        queueId: 'b7eaf81b-1b6b-eb11-b0b0-001dd8309f34',
        queueName: 'VBA ART',
        status: 'InProgress',
        submitterQuestion: 'test',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '3df87e62-a8bc-ef11-b8e9-001dd805523c',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241217-308837',
        attachments: null,
        categoryName: 'Defense Enrollment Eligibility Reporting System (DEERS)',
        createdOn: '12/17/2024 6:54:54 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Adding requests',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/17/2024 12:00:00 AM',
        queueId: 'e9a4bc5e-d5fa-eb11-94ef-001dd83015a1',
        queueName: 'EVSS Data Mismatch',
        status: 'New',
        submitterQuestion: 'Hemesh Test on Dec 17 for dashboard',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '46a76c10-5bbd-ef11-b8e9-001dd805523c',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241218-308843',
        attachments: null,
        categoryName: 'Veteran ID Card (VIC)',
        createdOn: '12/18/2024 4:13:54 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic:
          'Veteran Health Identification Card (VHIC) for health appointments',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/18/2024 12:00:00 AM',
        queueId: '39552049-1717-ec11-b6e6-001dd804cf90',
        queueName: 'Veteran Identification Card (VIC)',
        status: 'New',
        submitterQuestion: 'test',
        schoolFacilityCode: null,
        veteranRelationship: 'Spouse_SurvivingSpouse',
      },
    },
    {
      id: '37d37e1b-36b7-ef11-b8e9-001dd809b958',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241210-308784',
        attachments: null,
        categoryName: 'Veteran Readiness and Employment',
        createdOn: '12/10/2024 8:34:12 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Financial issues',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/12/2024 12:00:00 AM',
        queueId: '807de9d5-1b6b-eb11-b0b0-001dd8309f34',
        queueName: 'VBA Pittsburgh RO-VR&E',
        status: 'InProgress',
        submitterQuestion: 'Demo test',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: 'a79c4e2c-a9b8-ef11-b8e9-001dd809b958',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241212-308810',
        attachments: null,
        categoryName: 'Education benefits and work study',
        createdOn: '12/12/2024 4:50:26 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Work study',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/12/2024 12:00:00 AM',
        queueId: '4e7de9d5-1b6b-eb11-b0b0-001dd8309f34',
        queueName: 'Muskogee Work Study',
        status: 'InProgress',
        submitterQuestion:
          'This is a test question for the devs to see formatted replies',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '3ac11cee-2ebe-ef11-b8e9-001dd809b958',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241219-308852',
        attachments: [
          {
            id: '4ec11cee-2ebe-ef11-b8e9-001dd809b958',
            name: '2e577b0c43ca9c706002872fedcb02c3_exif.jpg',
          },
        ],
        categoryName: 'Education benefits and work study',
        createdOn: '12/19/2024 5:30:28 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'On-the-job training and apprenticeships',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/19/2024 12:00:00 AM',
        queueId: '527de9d5-1b6b-eb11-b0b0-001dd8309f34',
        queueName: 'Muskogee OJT/Apprenticeship',
        status: 'Solved',
        submitterQuestion: 'Testing Dec 19 files',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '678b6a15-d1b0-ef11-b8e9-001dd830a0af',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241202-308617',
        attachments: null,
        categoryName: 'Veteran ID Card (VIC)',
        createdOn: '12/2/2024 5:15:58 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic: 'Veteran ID Card (VIC) for discounts',
        levelOfAuthentication: 'Unauthenticated',
        lastUpdate: '12/2/2024 12:00:00 AM',
        queueId: '39552049-1717-ec11-b6e6-001dd804cf90',
        queueName: 'Veteran Identification Card (VIC)',
        status: 'Reopened',
        submitterQuestion: 'test',
        schoolFacilityCode: null,
        veteranRelationship: null,
      },
    },
    {
      id: '1aed76e7-5bbd-ef11-b8e9-001dd830a0af',
      type: 'inquiry',
      attributes: {
        inquiryNumber: 'A-20241218-308845',
        attachments: null,
        categoryName: 'Veteran ID Card (VIC)',
        createdOn: '12/18/2024 4:19:58 PM',
        correspondences: null,
        hasBeenSplit: false,
        inquiryTopic:
          'Veteran Health Identification Card (VHIC) for health appointments',
        levelOfAuthentication: 'Personal',
        lastUpdate: '12/18/2024 12:00:00 AM',
        queueId: '39552049-1717-ec11-b6e6-001dd804cf90',
        queueName: 'Veteran Identification Card (VIC)',
        status: 'Solved',
        submitterQuestion: 'test',
        schoolFacilityCode: null,
        veteranRelationship: 'Spouse_SurvivingSpouse',
      },
    },
  ],
};

// Based on Tue Jan 29th 2025  searching for reference number A-20250106-308944',
export const mockInquiryStatusResponse = {
  data: {
    id: null,
    type: 'inquiry_status',
    attributes: {
      status: 'New',
    },
  },
};

// Based on Tue Jan 21st 2025 for User 119 staging response when clicking 'Review Conversation' for inquiryNumber: 'A-20241210-308784',
export const mockInquiryResponse = {
  data: {
    id: 'a79c4e2c-a9b8-ef11-b8e9-001dd809b958',
    type: 'inquiry',
    attributes: {
      inquiryNumber: 'A-20241212-308810',
      allowAttachments: true,
      allowReplies: true,
      hasAttachments: false,
      attachments: null,
      categoryName: 'Education benefits and work study',
      createdOn: '12/12/2024 4:50:26 PM',
      correspondences: {
        data: [
          {
            id: '5fe4b4d0-cdc6-ef11-b8e9-001dd804fa0e',
            type: 'correspondence',
            attributes: {
              messageType: 'ReplyToVA',
              createdOn: '12/30/2024 4:48:02 PM',
              modifiedOn: '12/30/2024 4:48:06 PM',
              statusReason: 'Draft',
              description: 'Testing during CC',
              enableReply: true,
              attachments: null,
            },
          },
          {
            id: '08948c4f-c9c6-ef11-b8e9-001dd8053a71',
            type: 'correspondence',
            attributes: {
              messageType: 'ReplyToVA',
              createdOn: '12/30/2024 4:15:41 PM',
              modifiedOn: '12/30/2024 4:16:02 PM',
              statusReason: 'Draft',
              description:
                'Hi, testing a reply on 12/30 from staging to see if it shows up in the dashboard question details. TESTING!!! ',
              enableReply: true,
              attachments: null,
            },
          },
          {
            id: 'ef3e580b-b0b8-ef11-b8e9-001dd805523c',
            type: 'correspondence',
            attributes: {
              messageType: 'ResponseFromVA',
              createdOn: '12/12/2024 5:39:38 PM',
              modifiedOn: '12/12/2024 5:43:36 PM',
              statusReason: 'Completed',
              description:
                'Dear  Glen,<br /><br /><div data-wrapper="true" dir="ltr" style="font-family:\'Times\',\'Times New Roman\',Georgia-serif; font-size:12pt">This is a test response from Tyler 12/12.&nbsp;<strong>This is formatted in bold.&nbsp;</strong>This is a <a href="https://ask.va.gov">link</a>. This is also a link:&nbsp;<a href="https://ask.va.gov">https://ask.va.gov</a>.<br><br>Now I\'ll add a list:<ul><li style="list-style-position: inside;">List item 1</li><li style="list-style-position: inside;">List item 2</li><li style="list-style-position: inside;">List item 3</li></ul>\n<div style="list-style-position:inside"><span style="color:#e74c3c">This text is in red</span>. <span style="color:#ffffff"><span style="background-color:#2980b9">This text is in white with a blue background.</span></span><br>&nbsp;</div></div>Now I\'ll copy a standard text that an agent might use:<br><br>Due to security concerns, we cannot send a copy of your (Name of document) as an attachment to this inquiry. Please complete and submit VA Form 20-10206, you can find the form here https://www.vba.va.gov/pubs/forms/VBA-20-10206-ARE.pdf.<br /><br />Thank you for submitting your Inquiry to the U.S. Department of Veterans Affairs. <br /><br />If you have additional questions or need to provide follow-up information, you may close this window and click ‘Send VA a Message’ to enter additional information. Please note that the opportunity to update an issue is only available for several days after a response is posted. For updates after that period and for any NEW issues, please submit a new Inquiry.<br /><br />It is our commitment to provide an excellent customer service experience to all Veterans and members of our Veteran community. To all who have served or continue to serve, we thank you for your service. <br /><br />If you are in immediate danger, please call 911. Please do not use the Ask VA inquiry for urgent needs or medical emergencies.<br /><br />For immediate help in dealing with a suicidal crisis, please call 988 and Press 1, chat online at VeteransCrisisLine.net/Chat (https://www.veteranscrisisline.net/get-help/chat/) or text 838255.<br />',
              enableReply: true,
              attachments: null,
            },
          },
          {
            id: 'aefa679d-b0b8-ef11-b8e9-001dd805523c',
            type: 'correspondence',
            attributes: {
              messageType: 'Notification',
              createdOn: '12/12/2024 5:43:39 PM',
              modifiedOn: '1/14/2025 5:49:16 PM',
              statusReason: 'Sent',
              description:
                '<p>Dear Glen,</p>\n<p>A new message has been posted to your Ask VA (AVA) inbox.&nbsp; To view your message please log in to https://Ask.VA.gov</p>\n<p>Please DO NOT reply to this email as it is system generated.</p>\n<p>If you are in immediate danger, please call 911. Please do not use the Ask VA inquiry for urgent needs or medical emergencies.</p>\n<p>For immediate help in dealing with a suicidal crisis, please call 988 and Press 1, chat online at VeteransCrisisLine.net/Chat  (https://www.veteranscrisisline.net/get-help/chat/) or text 838255. "</p>',
              enableReply: true,
              attachments: null,
            },
          },
          {
            id: 'a931a8d7-d9cb-ef11-b8e9-001dd805523c',
            type: 'correspondence',
            attributes: {
              messageType: 'ReplyToVA',
              createdOn: '1/6/2025 2:56:43 AM',
              modifiedOn: '1/6/2025 2:56:55 AM',
              statusReason: 'Draft',
              description:
                'Thank you for the response. I\'m testing this "Send a reply" to see if this flow works. Additionally, I\'m attaching a test upload PDF, JPG, and PNG to see if the attachments also work',
              enableReply: true,
              attachments: [
                {
                  id: 'b1b0c9dd-d9cb-ef11-b8e9-001dd805523c',
                  name: 'test-upload-pdf.pdf',
                },
                {
                  id: 'bfb0c9dd-d9cb-ef11-b8e9-001dd805523c',
                  name: 'test-upload-jpg.jpg',
                },
                {
                  id: 'd2b0c9dd-d9cb-ef11-b8e9-001dd805523c',
                  name: 'test-upload-png.png',
                },
              ],
            },
          },
        ],
      },
      hasBeenSplit: false,
      inquiryTopic: 'Work study',
      levelOfAuthentication: 'Personal',
      lastUpdate: '12/12/2024 12:00:00 AM',
      queueId: '4e7de9d5-1b6b-eb11-b0b0-001dd8309f34',
      queueName: 'Muskogee Work Study',
      status: 'InProgress',
      submitterQuestion:
        'This is a test question for the devs to see formatted replies',
      schoolFacilityCode: null,
      veteranRelationship: null,
    },
  },
};

// Based on Wed Dec 30 for User 119 staging response when clicking 'Review Conversation' for inquiryNumber: 'A-20241230-308899',
export const mockInquiryResponseNoCorrespondence = {
  data: {
    id: '81d43742-c8c6-ef11-b8e9-001dd804fa0e',
    type: 'inquiry',
    attributes: {
      inquiryNumber: 'A-20241230-308899',
      attachments: null,
      categoryName: 'Veteran ID Card (VIC)',
      createdOn: '12/30/2024 4:08:15 PM',
      correspondences: [],
      hasBeenSplit: false,
      inquiryTopic: 'Veteran ID Card (VIC) for discounts',
      levelOfAuthentication: 'Personal',
      lastUpdate: '12/30/2024 12:00:00 AM',
      queueId: '39552049-1717-ec11-b6e6-001dd804cf90',
      queueName: 'Veteran Identification Card (VIC)',
      status: 'New',
      submitterQuestion: 'test',
      schoolFacilityCode: null,
      veteranRelationship: null,
    },
  },
};

// Example reply response
export const mockReplyResponse = {};

export const mockSubmitResponse = {
  inquiryNumber: 'A-20230622-306458',
  listOfAttachments: [],
};

// Example response taken from https://staging-api.va.gov/ask_va_api/v0/download_attachment?id=4ec11cee-2ebe-ef11-b8e9-001dd809b958
export const mockAttachmentResponse = {
  data: {
    id: null,
    type: 'attachment',
    attributes: {
      fileName: 'testingFile.png',
      fileContent:
        'ZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEd0FBQUEyQ0FZQUFBQ2JaL29VQUFBQlkybERRMUJKUTBNZ1VISnZabWxzWlFBQUtKRmpZR0RpU1N3b3lHRmhZR0RJelNzcENuSjNVb2lJakZKZ2Y4bkF6TUREd01kZ3dXQ2NtRnhjNEJnUTRBTlV3Z0NqVWNHM2F3eU1JUHF5THNpc0hBN2orTGU2QWZNMGZpMEo3R21iZEJsVFBRcmdTa2t0VGdiU2Y0RFlKTG1ncUlTQmdkRUF5QTRvTHlrQXNSdUFiSkVpb0tPQTdDa2dkanFFdlFMRVRvS3c5NERWaEFRNUE5a1hnR3lCNUl6RUZDRDdBWkN0azRRa25vN0V6czBwVFlhNkFlUjZudFM4MEdBZ0xRSEVNZ3d1REs0TVBrQ293QkRNWU1SZ0RzU0dESUVNd1RqMG1JRDFPRFBrTXhRd1ZESVVNV1F5cEROa01KUUFkVHNDUlFvWWNoaFNnV3hQaGp5R1pBWTlCaDBnMjRqQkFJaE5RV0dOSG9ZSXNjSVBEQXdXazRCV05TUEVZbU1ZR0xZQi9jVnpEQ0dtM2dYMFRoOER3NUVuQllsRmlmQ1FaZnpHVXB4bWJBUmhjMjluWUdDZDl2Ly81M0FHQm5aTkJvYS8xLy8vLzczOS8vKy95eGdZbUc4eE1CejRCZ0NBNDJWak56emJyd0FBQUlwbFdFbG1UVTBBS2dBQUFBZ0FCQUVhQUFVQUFBQUJBQUFBUGdFYkFBVUFBQUFCQUFBQVJnRW9BQU1BQUFBQkFBSUFBSWRwQUFRQUFBQUJBQUFBVGdBQUFBQUFBQUNRQUFBQUFRQUFBSkFBQUFBQkFBT1NoZ0FIQUFBQUVnQUFBSGlnQWdBRUFBQUFBUUFBQUR5Z0F3QUVBQUFBQVFBQUFEWUFBQUFBUVZORFNVa0FBQUJUWTNKbFpXNXphRzkwb2VJZVpnQUFBQWx3U0ZsekFBQVdKUUFBRmlVQlNWSWs4QUFBQWRScFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWxoTlVDQkRiM0psSURZdU1DNHdJajRLSUNBZ1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNEtJQ0FnSUNBZ1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaWGhwWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOWxlR2xtTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZsRWFXMWxibk5wYjI0K05UUThMMlY0YVdZNlVHbDRaV3haUkdsdFpXNXphVzl1UGdvZ0lDQWdJQ0FnSUNBOFpYaHBaanBRYVhobGJGaEVhVzFsYm5OcGIyNCtOakE4TDJWNGFXWTZVR2w0Wld4WVJHbHRaVzV6YVc5dVBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwVmMyVnlRMjl0YldWdWRENVRZM0psWlc1emFHOTBQQzlsZUdsbU9sVnpaWEpEYjIxdFpXNTBQZ29nSUNBZ0lDQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNEtJQ0FnUEM5eVpHWTZVa1JHUGdvOEwzZzZlRzF3YldWMFlUNEtlVWc4RndBQUFCeHBSRTlVQUFBQUFnQUFBQUFBQUFBYkFBQUFLQUFBQUJzQUFBQWJBQUFCdXBMY0s1NEFBQUdHU1VSQlZHZ0ZZaFFVRnYvUE1JSUE0NmlIaDNsc2o4YndNSTlnaHRFWUhvM2hZUllDbzBsNm1FVW9obmRHWXhnalNJYVp3R2dNRDdNSXhmRE9hQXhqQk1rd0V4aU5ZVW9qbElXRmhTZ2ovdjM3eHdEQzlBWlVqZUZORzlZeXFLbXBFdTJIdjMvL01uejkrcFhod3NWTERCTW5UV0c0ZXZVYTBYckpWVWhWRHg4OWNvQkJXRWlJWExjd1BIejRpQ0UrSVpuaHhjdVhaSnRCU09PZzhqRElzYUJZTHkyclpOaTJmUWNodDVNbFArZzhEUElGS0c5SFJNWXdYTHA4aFN4UDRkTkVVdzlmdkhTWklTZTNBS3Y5NHVKaURQcjZlZ3l4MFZFTUNncnlHR3ArL1BqQllHeHFBWXh4Nmhac05QWHdzV1BIR1pKUzBqRThneTZRbjVmRGtKbVJoaTdNTUdIaVpJWVpNMmRqaUZNaU1DZzhEUEpBZlYwTlEyUkVHSXBmUG56NHdHQmhaWWNpUmlsbjBIZ1k1SkdqaC9jekNBc0xvL2hKUTBzUGhVOHBaMUI1dUwrdm04SFR3eDNGVDI0ZVBneVBIajFDRVVQbXFDZ3JNM2g0dURHb3Fxb3d5TXJLTW5CeWNEQzhldldLNGZHVEp3elhyOTlnV0xscURjT2ZQMy9nV2dBQUFBRC8vNU0xSkcwQUFBT3VTVVJCVk8yWVdVaFVVUmpILzJPVFB1aExqalNaNllPU283YTV0TGhSWVQxVUpHV0VWR3FHbENhVExScGlaUkdaaXBVVkVSUXRhRmtaWkNVeDVVSTJhbG1ZdTRXdG9pRUs5dUlrQ3U3bXVYV1A5NHpqT05ZTXpZVU9EUGRiRG1lKzMxbStzMGhteWVTak1GS3BlRlVLbWEwdGJlMzE2emVJMmgxRDlhbUUwTkN0T0hYeUJGTXRacThTWmVVdkdSdFJsdnA0NDNqeVVTZ1VyaE44UXNQUTBCQkt5OHFSY2pvTm5aM2ZJVEVuNExUVVU5Z1NzbGtZTHpZR2grQnJjek5qU3o2V2hQQ3dIWXh0S21Wd2NCQjdvbVBOQzFoZFVnUjdlM3NtZG8rRm5oZ1pHYUcycTFjdVkvV3FsVlNmampBNk9tbyt3SkU3dzNFa0taR0p2N2UzRno3TC9LZ3QvdUIrUkVmdnBqb3ZrQTZwcWFuRngwK2ZvTkg4d0R3SEIvajRlTUhKeVltdlFyOW1NYVZEUWpZaFBUV0ZCc1VMV1ZtM2tIRTJrMU1kSGVlaHFFQUZDd3NMM3MxOUt5dmZJdTVBUExxN3V4azdVVHpjM1hBLzl3NHNMUzJwNzU4Qno1aGhnUVVlSG9pTFV5SXd3QjhTaVlRR1JRU1NiTWpvOXZmM2MvYjh4dy9ncGxBd2RRcUxpbkh3MEdIR3BxMHNXYndJdWZkeWFFZVpGSmo4T1ZrM3VvbzJvSFlkNWI0REtIbWg1c3cyTmphb3FxeGdPcVdyU3dPL0FNUFc4b2IxNjNBKzh3elhsc21CdFVHbTBra0hYYmg0Q2RldTM2UlY5eWxqUVg3Q0VxdU1nMXBkSmpUcGxXdXEzc0RhMnRxMFNVdHZCRHFjUFQwOWlCN2JkMnRyNnhqdmsveUhjSFdkejlpQ04yMWg5S21VaXhmT3djWForZDhEa3d6YjJ2b04yYmR6a0pmM2lObUNlSWlLbDJySVpESmUvYXV2U2FkMFU5TUhwS1ZuNkF4d1lHQUFuNzk4UlY5Zm4wNi8wTmhRVndVckt5dWg2WTlsa3dKUDkyZzVHVVhUKzNxYVpTZXJZNmhkRk1DTjlkWE1Ya29TbTdyVThJUWw3QXhSQUd0ZlN1cnJHN0J0UjRTUXcyQlpGTUJQVmZsY2h1V3B5THIzOUY3T3E5UDZpZ0tZWEJuSjFWRll5QW1MbkxRTUxTVHArZnY3bW5aYk1sYlNrc3RubzB6OW5HSFRhRFFJWEJuRUhVRVp4eVFLUDB0RU1jS0VvYmhRTmVIMlV6MTJRd3FQMkRVSjRyZzVPK3NHZkZmOFdnS2lBZmIyOXNMZG5Hem1QRTJRT2pvNkVCRVpoZmIyam5IQzN4S1p4cG5uTXJCMlRSRDFpUWFZUkt6dnBhT2xwWlY3Q21wcmE0T2RuUjNjM1JRSURBeUFWQ3Fsc0VRUUZUQUpPUGZ1YlhoNWVSTHhqNHJvZ0FtbHZwSFcxd3Zrc2NDa3dNOEtDaEdmd0Q3YjZBdG9PajUvUDE4a0ppWk1lQlRRMVFaWjUrZkhycHdxMVRQakF1djZNMVBiNXNqbENBdmJEaGNYWnpqTW5RdnBUQ21HaDRhNVpFYldOZG1yR3hyZjBUQ01Pc0swVlRNVy9nT2I4ZUFZSmJTZkxsTkhEUXpWYWM4QUFBQUFTVVZPUks1Q1lJST0=',
    },
  },
};
