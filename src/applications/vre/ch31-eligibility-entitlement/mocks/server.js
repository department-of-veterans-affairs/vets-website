/* eslint-disable camelcase */
const responses = {
  'POST /vre/v0/ch31_case_milestones': async (_, res) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Uncomment to test error status
    // return res.status(500);

    return res.status(200).json({
      data: {
        id: '',
        type: 'ch31_case_milestones',
        attributes: {
          res_case_id: 123,
          response_message: 'The case milestones have been updated',
        },
      },
    });
  },
  'GET /vre/v0/ch31_case_details': {
    data: {
      id: '',
      type: 'ch31_case_details',
      attributes: {
        resCaseId: 123456,
        isTransferredToCwnrs: false,
        orientationAppointmentDetails: {
          appointmentDateTime: '2026-01-14T18:46:18.688Z',
          appointmentPlace: '31223 Corn Drive , Hamilton NJ-21223',
        },
        externalStatus: {
          isDiscontinued: false,
          discontinuedReason: '079 - Plan Developed/Redeveloped',
          isInterrupted: false,
          interruptedReason: '079 - Plan Developed/Redeveloped',
          stateList: [
            {
              stepCode: 'APPL',
              status: 'COMPLETED',
            },
            {
              stepCode: 'ELGLDET',
              status: 'COMPLETED',
            },
            {
              stepCode: 'ORICMPT',
              status: 'ACTIVE',
            },
            {
              stepCode: 'INTAKE',
              status: 'PENDING',
            },
            {
              stepCode: 'ENTLDET',
              status: 'PENDING',
            },
            {
              stepCode: 'PLANSELECT',
              status: 'PENDING',
            },
            {
              stepCode: 'BFSACT',
              status: 'PENDING',
            },
          ],
        },
      },
    },
  },
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3 },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [],
        prefills_available: ['21-526EZ'],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'form526',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
        ],
        va_profile: {
          status: 'OK',
          birth_date: '19511118',
          family_name: 'Hunter',
          gender: 'M',
          given_names: ['Julio', 'E'],
          active_status: 'active',
          facilities: [
            {
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
            },
          ],
        },
      },
    },
    meta: { errors: null },
  },

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'vre_eligibility_status_phase_2_updates', value: true },
      ],
    },
  },
};

module.exports = responses;
