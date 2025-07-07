const all = {
  data: [
    {
      id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 207,
        date: '2021-01-14T09:30:21Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'COVID-19',
        manufacturer: 'Moderna US, Inc.',
        note:
          'Dose #2 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
        reaction: null,
        shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          },
        },
      },
    },
    {
      id: 'I2-N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 207,
        date: '2020-12-18T12:24:55Z',
        doseNumber: 'Series 1',
        doseSeries: 1,
        groupName: 'COVID-19',
        manufacturer: 'Moderna US, Inc.',
        note:
          'Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
        reaction: 'No reaction noted',
        shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          },
        },
      },
    },
    {
      id: 'I2-NGT2EAUYD7N7LUFJCFJY3C5KYY000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2018-05-10T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #54 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Respiratory distress',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          },
        },
      },
    },
    {
      id: 'I2-2ZWOY2V6JJQLVARKAO25HI2V2M000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2017-05-04T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #53 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Fever',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: null,
          links: {
            related: null,
          },
        },
      },
    },
    {
      id: 'I2-7PQYOMZCN4FG2Z545JOOLAVCBA000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 33,
        date: '2016-04-28T12:24:55Z',
        doseNumber: 'Series 1',
        doseSeries: 1,
        groupName: 'PneumoPPV',
        manufacturer: null,
        note:
          'Dose #1 of 1 of pneumococcal polysaccharide vaccine  23 valent vaccine administered.',
        reaction: 'Other',
        shortDescription: 'pneumococcal polysaccharide vaccine  23 valent',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          },
        },
      },
    },
    {
      id: 'I2-JYYSRLCG3BN646ZPICW25IEOFQ000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2016-04-28T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #52 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Anaphylaxis or collapse',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
          },
        },
      },
    },
    {
      id: 'I2-F3CW7J5IRY6PVIEVDMRL4R4W6M000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 133,
        date: '2015-04-23T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'PneumoPCV',
        manufacturer: null,
        note:
          'Dose #1 of 5 of Pneumococcal conjugate PCV 13 vaccine administered.',
        reaction: 'Vomiting',
        shortDescription: 'Pneumococcal conjugate PCV 13',
      },
      relationships: {
        location: {
          data: null,
          links: {
            related: null,
          },
        },
      },
    },
    {
      id: 'I2-GY27FURWILSYXZTY2GQRNJH57U000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2015-04-23T12:24:55Z',
        doseNumber: 'Series 1',
        doseSeries: 2,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #51 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Vomiting',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
          },
        },
      },
    },
    {
      id: 'I2-VLMNAJAIAEAA3TR34PW5VHUFPM000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2014-04-17T12:24:55Z',
        doseNumber: 'Series 1',
        doseSeries: 2,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #50 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Local reaction or swelling',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          },
        },
      },
    },
    {
      id: 'I2-DOUHUYLFJLLPSJLACUDAJF5GF4000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2013-04-11T12:24:55Z',
        doseNumber: 'Series 1',
        doseSeries: 2,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #49 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Convulsions',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          },
        },
      },
    },
    {
      id: 'I2-LA34JJPECU7NQFSNCRULFSVQ3M000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 113,
        date: '2012-04-05T12:24:55Z',
        doseNumber: 'Booster',
        doseSeries: 1,
        groupName: 'Td',
        manufacturer: null,
        note:
          'Dose #3 of 8 of Td (adult) preservative free vaccine administered.',
        reaction: 'Respiratory distress',
        shortDescription: 'Td (adult) preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
          },
        },
      },
    },
    {
      id: 'I2-YYBTWDMLX6WLFV3GBSIGT5CZO4000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2012-04-05T12:24:55Z',
        doseNumber: 'Booster',
        doseSeries: 1,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #48 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Anaphylaxis or collapse',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000',
          },
        },
      },
    },
    {
      id: 'I2-RWRNZDHNNCHLJJKJDJVVVAZHNQ000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2011-03-31T12:24:55Z',
        doseNumber: 'Series 1',
        doseSeries: 1,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #47 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Other',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: {
            id: 'I2-4KG3N5YUSPTWD3DAFMLMRL5V5U000000',
            type: 'location',
          },
          links: {
            related:
              'staging-api.va.gov/mobile/v0/health/locations/I2-4KG3N5YUSPTWD3DAFMLMRL5V5U000000',
          },
        },
      },
    },
    {
      id: 'I2-6SIQZNJCIOAQOGES6YOTSQAWJY000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2014-03-25T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #46 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Vomiting',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: null,
          links: {
            related: null,
          },
        },
      },
    },
    {
      id: 'I2-A7XD2XUPAZQ5H4Y5D6HJ352GEQ000000',
      type: 'immunization',
      attributes: {
        location: 'Cheyenne VA Medical Center',
        cvxCode: 140,
        date: '2009-03-19T12:24:55Z',
        doseNumber: 'Booster',
        doseSeries: 1,
        groupName: 'FLU',
        manufacturer: null,
        note:
          'Dose #45 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        reaction: 'Vomiting',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
      relationships: {
        location: {
          data: null,
          links: {
            related: null,
          },
        },
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 2,
      totalEntries: 15,
    },
  },
  links: {
    self:
      'https://staging-api.va.gov/mobile/v1/health/immunizations?useCache=true&page[size]=10&page[number]=1',
    first:
      'https://staging-api.va.gov/mobile/v1/health/immunizations?useCache=true&page[size]=10&page[number]=1',
    prev: null,
    next:
      'https://staging-api.va.gov/mobile/v1/health/immunizations?useCache=true&page[size]=10&page[number]=2',
    last:
      'https://staging-api.va.gov/mobile/v1/health/immunizations?useCache=true&page[size]=10&page[number]=2',
  },
};

const single = (req, res) => {
  const { id } = req.params;
  const vaccine = all.data.find(v => v.id === id);
  if (vaccine) {
    res.json({ data: vaccine });
  } else {
    res
      .status(404)
      .json({ errors: [{ title: 'Not Found', detail: 'Vaccine not found' }] });
  }
};
module.exports = { all, single };
