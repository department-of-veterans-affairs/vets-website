const emptySignature = {
  data: {
    id: '',
    type: 'message_signature',
    attributes: {
      signatureName: '',
      signatureTitle: '',
      includeSignature: false,
    },
  },
};

const filledSignature = {
  data: {
    id: '',
    type: 'message_signature',
    attributes: {
      signatureName: 'Testing McTesterson',
      signatureTitle: 'THE Test Person',
      includeSignature: true,
    },
  },
};

module.exports = {
  emptySignature,
  filledSignature,
};
