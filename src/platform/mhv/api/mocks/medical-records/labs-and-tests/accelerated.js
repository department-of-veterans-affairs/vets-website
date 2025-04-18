const sample = {
  data: [
    {
      id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
      type: 'diagnostic_report',
      attributes: {
        display: 'Surgical Pathology',
        testCode: 'SP',
        dateCompleted: '2019-03-12T16:30:00Z',
        sampleTested: 'BONE MARROW',
        bodySite: null,
        encodedData:
          'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
        location: 'VA TEST LAB',
      },
    },
    {
      id: 'e9513940-bf84-4120-ac9c-718f537b00e0',
      type: 'DiagnosticReport',
      attributes: {
        display: 'CH',
        testCode: 'CH',
        dateCompleted: '2025-01-23T22:06:02Z',
        sampleTested: 'SERUM',
        bodySite: 'Central Vien',
        location: 'CHYSHR TEST LAB',
        orderedBy: 'ZZGeorge Washington',
        observations: [
          {
            testCode: 'GLUCOSE',
            referenceRange: '70 - 110',
            status: 'final',
            sampleTested: 'SERUM',
            bodySite: 'Central Vien',
            comments: 'this is a comment',
            value: {
              text: '99 mg/dL',
              type: 'Quantity',
            },
          },
          {
            testCode: 'UREA NITROGEN',
            referenceRange: '7 - 18',
            status: 'final',
            comments: '',
            value: {
              text: '200 mg/dL',
              type: 'Quantity',
            },
          },
          {
            testCode: 'CREATININE',
            referenceRange: '0.6 - 1.3',
            status: 'final',
            comments: '',
            value: {
              text: '5 mg/dL',
              type: 'Quantity',
            },
          },
          {
            testCode: 'SODIUM',
            referenceRange: '136 - 145',
            status: 'final',
            comments: '',
            value: {
              text: '8 meq/L',
              type: 'Quantity',
            },
          },
          {
            testCode: 'POTASSIUM',
            referenceRange: '3.5 - 5.1',
            status: 'final',
            comments: '',
            value: {
              text: '24 meq/L',
              type: 'Quantity',
            },
          },
          {
            testCode: 'CHLORIDE',
            referenceRange: '98 - 107',
            status: 'final',
            comments: '',
            value: {
              text: '2 meq/L',
              type: 'Quantity',
            },
          },
          {
            testCode: 'CO2',
            valueQuantity: '2 meq/L',
            referenceRange: '22 - 29',
            status: 'final',
            comments: '',
            value: {
              text: '2 meq/L',
              type: 'Quantity',
            },
          },
        ],
      },
    },
    {
      id: 'e9513940-bf84-4120-ac9c-718f537b00e1',
      type: 'DiagnosticReport',
      attributes: {
        display: 'CH - FULL SAMPLE',
        testCode: 'CH',
        dateCompleted: '2025-01-23T22:06:02Z',
        sampleTested: 'SERUM',
        bodySite: 'Central Vien',
        location: 'CHYSHR TEST LAB',
        orderedBy: 'ZZGeorge Washington',
        observations: [
          {
            testCode: 'GLUCOSE',
            referenceRange: '70 - 110',
            status: 'final',
            sampleTested: 'SERUM',
            bodySite: 'Central Vien',
            comments: 'this is a comment',
            value: {
              text: '99 mg/dL',
              type: 'Quantity',
            },
          },
          {
            testCode: 'UREA NITROGEN',
            referenceRange: '7 - 18',
            status: 'final',
            comments: '',
            value: {
              text: '200 mg/dL',
              type: 'Quantity',
            },
          },
        ],
      },
    },
  ],
};

const single = id => {
  const sampleData = sample.data.find(item => item.id === id);
  if (!sampleData) {
    return null;
  }
  return {
    data: sampleData,
  };
};

module.exports = {
  sample,
  single,
};
