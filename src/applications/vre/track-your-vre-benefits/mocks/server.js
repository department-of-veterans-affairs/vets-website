/* eslint-disable camelcase */
const responses = {
  'POST /vre/v0/case_get_document': async (req, res) => {
    const binaryBody =
      'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQogICAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PgogICAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNDEgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiAxMDAgNzAwIFRkIChNb2NrIFBERikgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCjAwMDAwMDAyNTMgMDAwMDAgbiAKMDAwMDAwMDMyMyAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQxMwolJUVPRgo=';

    return res
      .status(200)
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        Connection: 'keep-alive',
        Server: 'Apache',
        'Cache-Control': 'no-cache, private',
        'X-Trace-Id': '',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy-Report-Only':
          "style-src 'unsafe-inline' 'self' 'strict-dynamic' 'nonce-MzZlOTkyZDAtOTI3NS00Y2QxLTgxNWMtYzYzZmY1NTg5MGIy'; child-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' 'nonce-MmRlYTdiOTItNWI5My00ZmRlLTg1MzMtOGNmZjYwM2RlNjIx'; object-src https:; frame-src https:; img-src https:; default-src 'self'; font-src 'self' https: data:; report-uri /suite/rest/a/logging/latest/csp/report; report-to report;",
        'Content-Security-Policy':
          'report-uri /suite/rest/a/logging/latest/csp/report; report-to report;',
        'Reporting-Endpoints':
          'report="/suite/rest/a/logging/latest/csp/report"',
        'X-XSS-Protection': '1; mode=block',
        'Requested-While-Authenticated': 'false',
        Vary: 'Accept-Encoding',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security':
          'max-age=16000000; includeSubDomains; preload;',
      })
      .send(Buffer.from(binaryBody, 'base64'));

    // test error response
    // return res.status(404).json({
    //   "errors": [
    //     {
    //       "title": "Not Found",
    //       "detail": "Not Found",
    //       "code": "RES_CASE_GET_DOCUMENT_404",
    //       "status": "404"
    //     }
    //   ]
    // })
  },
  'POST /vre/v0/ch31_case_milestones': async (_, res) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

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
          isDiscontinued: true,
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
              status: 'COMPLETED',
            },
            {
              stepCode: 'INTAKE',
              status: 'COMPLETED',
            },
            {
              stepCode: 'ENTLDET',
              status: 'COMPLETED',
            },
            {
              stepCode: 'PLANSELECT',
              status: 'COMPLETED',
            },
            {
              stepCode: 'BFSACT',
              status: 'ACTIVE',
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
