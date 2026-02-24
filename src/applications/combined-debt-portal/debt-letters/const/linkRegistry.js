export const LINK_REGISTRY = {
  details: {
    textKey: 'common.linkText.reviewDetails',
    href: ({ refId }) => `/debt-balances/${refId}`,
  },
  resolve: {
    href: ({ refId }) => `/debt-balances/${refId}/resolve`,
    textKey: 'common.linkText.resolveOverpayment',
  },
  requestHelp: {
    href: '/request-debt-help-form-5655/',
    textKey: 'common.linkText.requestHelp',
  },
  makePayment: {
    href: ({ refId }) => `/debt-balances/${refId}/resolve#howDoIPay`,
    textKey: 'common.linkText.makeAPayment',
  },
  askVa: {
    href: 'https://ask.va.gov/',
    textKey: 'common.linkText.askVa',
  },
  updateAddress: {
    href: '/profile/contact-information#addresses',
    textKey: 'common.linkText.updateAddress',
  },
};
