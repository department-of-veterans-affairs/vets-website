import { rest } from 'msw';
import environment from 'platform/utilities/environment';

export const newPaymentAccount = {
  accountType: 'Savings',
  financialInstitutionName: 'COMERICA BANK',
  accountNumber: '*****6789',
  financialInstitutionRoutingNumber: '*****4321',
};

const prefix = environment.API_URL;

export const updateDirectDepositSuccess = [
  rest.put(
    // I'd prefer to just set the route as `ppiu/payment_information` or at least `v0/ppiu/payment_information`
    `${prefix}/v0/ppiu/payment_information`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            attributes: {
              responses: [
                {
                  paymentAccount: newPaymentAccount,
                },
              ],
            },
          },
        }),
      );
    },
  ),
];

export const updateDirectDepositFailure = [
  rest.put(`${prefix}/v0/ppiu/payment_information`, (req, res, ctx) => {
    return res.once(
      ctx.status(402),
      ctx.json({
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text:
                    'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
                },
              ],
            },
          },
        ],
      }),
    );
  }),
];
