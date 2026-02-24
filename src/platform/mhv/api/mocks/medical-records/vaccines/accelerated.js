const all = {
  data: [
    // Lighthouse vaccine records for accelerating testing
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
    // Additional SCDF vaccine records for accelerating testing
    {
      id: 'c4c9185a-42d9-4408-8376-56c16fe95b0e',
      type: 'immunization',
      attributes: {
        cvxCode: 90675,
        date: '2026-01-06T05:00:00Z',
        doseNumber: 'PARTIALLY COMPLETE',
        doseSeries: null,
        groupName: 'RABIES, INTRAMUSCULAR INJECTION',
        location: null,
        manufacturer: null,
        note: null,
        reaction: null,
        shortDescription: 'RABIES, INTRAMUSCULAR INJECTION',
        administrationSite: null,
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: '31128fb3-08bc-4385-b7b9-72991298a807',
      type: 'immunization',
      attributes: {
        cvxCode: 90675,
        date: '2026-01-03T05:00:00Z',
        doseNumber: 'SERIES 1',
        doseSeries: null,
        groupName: 'RABIES, INTRAMUSCULAR INJECTION',
        location: null,
        manufacturer: null,
        note: null,
        reaction: null,
        shortDescription: 'RABIES, INTRAMUSCULAR INJECTION',
        administrationSite: null,
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'cde96bc7-fcc0-4bee-bcc0-c7f99515a83f',
      type: 'immunization',
      attributes: {
        cvxCode: 90750,
        date: '2025-12-12T18:00:00Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'ZOSTER RECOMBINANT',
        location: 'TEST',
        manufacturer: 'GLAXOSMITHKLINE',
        note: null,
        reaction: null,
        shortDescription: 'ZOSTER RECOMBINANT',
        administrationSite: 'RIGHT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: '2d86190a-cde8-4872-9e44-b26a9fa59bf4',
      type: 'immunization',
      attributes: {
        cvxCode: 90662,
        date: '2025-12-12T17:36:00Z',
        doseNumber: 'COMPLETE',
        doseSeries: null,
        groupName: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        location: 'TEST',
        manufacturer: 'SANOFI PASTEUR',
        note: '2026 flu shot',
        reaction: null,
        shortDescription: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        administrationSite: 'RIGHT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'M20875183434',
      type: 'immunization',
      attributes: {
        cvxCode: 140,
        date: '2025-12-10T16:20:00-06:00',
        doseNumber: 'Unknown',
        doseSeries: null,
        groupName: 'influenza virus vaccine, inactivated',
        location: '556 Captain James A Lovell IL VA Medical Center',
        manufacturer: 'Seqirus USA Inc',
        note: 'Added comment "note"',
        reaction: null,
        shortDescription: 'influenza virus vaccine, inactivated',
        administrationSite: 'Shoulder, left (deltoid)',
        lotNumber: 'AX5586C',
        status: 'completed',
      },
    },
    {
      id: 'M20875183430',
      type: 'immunization',
      attributes: {
        cvxCode: 165,
        date: '2025-12-10T14:19:00-06:00',
        doseNumber: 'Unknown',
        doseSeries: null,
        groupName: 'human papillomavirus vaccine',
        location: '556 Captain James A Lovell IL VA Medical Center',
        manufacturer: 'Merck & Company Inc',
        note: null,
        reaction: null,
        shortDescription: 'human papillomavirus vaccine',
        administrationSite: 'Shoulder, left (deltoid)',
        lotNumber: 'Z005469',
        status: 'completed',
      },
    },
    {
      id: 'e68d1552-49a4-47cc-bb00-2817de60e4e9',
      type: 'immunization',
      attributes: {
        cvxCode: 90717,
        date: '2025-11-25T17:20:00Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'YELLOW FEVER LIVE',
        location: 'EVENING PRIMARY CARE',
        manufacturer: 'SANOFI PASTEUR',
        note: 'Adding comment, test comment, comment comment comment ',
        reaction: null,
        shortDescription: 'YELLOW FEVER LIVE',
        administrationSite: 'LEFT UPPER ARM',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'M20875036607',
      type: 'immunization',
      attributes: {
        cvxCode: 312,
        date: '2025-10-01',
        doseNumber: 'Unknown',
        doseSeries: null,
        groupName: 'COVID-19 vaccine(Spikevax 12y+)',
        location: '556 Captain James A Lovell IL VA Medical Center',
        manufacturer: null,
        note: null,
        reaction: null,
        shortDescription: 'COVID-19 vaccine(Spikevax 12y+)',
        administrationSite: null,
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'M20875036611',
      type: 'immunization',
      attributes: {
        cvxCode: 88,
        date: '2025-10-01',
        doseNumber: 'Unknown',
        doseSeries: null,
        groupName: 'influenza virus vaccine, unspecified',
        location: '556 Captain James A Lovell IL VA Medical Center',
        manufacturer: null,
        note: null,
        reaction: null,
        shortDescription: 'influenza virus vaccine, unspecified',
        administrationSite: null,
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: '141d2a94-2f0c-488f-bd43-5c5f7e7e15e7',
      type: 'immunization',
      attributes: {
        cvxCode: 90732,
        date: '2024-11-26T21:35:00Z',
        doseNumber: 'SERIES 1',
        doseSeries: null,
        groupName: 'PNEUMOCOCCAL POLYSACCHARIDE PPV23',
        location: 'NUCLEAR MED',
        manufacturer: 'MERCK AND CO., INC.',
        note: null,
        reaction: null,
        shortDescription: 'PNEUMOCOCCAL POLYSACCHARIDE PPV23',
        administrationSite: 'LEFT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'e798f513-9298-49e0-ba49-609cf4b597f4',
      type: 'immunization',
      attributes: {
        cvxCode: 90619,
        date: '2024-11-14T04:19:00Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'MENINGOCOCCAL CONJUGATE QUADRIVALENT, MENACWY-TT (MCV4)',
        location: 'SIDNEY PRIMARY CARE',
        manufacturer: 'GLAXOSMITHKLINE',
        note: null,
        reaction: null,
        shortDescription:
          'MENINGOCOCCAL CONJUGATE QUADRIVALENT, MENACWY-TT (MCV4)',
        administrationSite: 'LEFT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'f347de7c-e045-4dd6-9a3a-cd0e3cb8b760',
      type: 'immunization',
      attributes: {
        cvxCode: 90662,
        date: '2024-10-18T21:10:00Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        location: 'GREELEY NURSE',
        manufacturer: 'SANOFI PASTEUR',
        note: 'Annual flu',
        reaction: null,
        shortDescription: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        administrationSite: 'RIGHT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'a794f16c-4109-4065-9405-a3730ac6754d',
      type: 'immunization',
      attributes: {
        cvxCode: 91322,
        date: '2024-10-18T21:10:00Z',
        doseNumber: 'BOOSTER',
        doseSeries: null,
        groupName:
          'COVID-19 (MODERNA), MRNA, LNP-S, PF, 50 MCG/0.5 ML (AGES 12+ YEARS)',
        location: 'COVID VACCINE CLIN1',
        manufacturer: 'MODERNA US, INC.',
        note: null,
        reaction: null,
        shortDescription:
          'COVID-19 (MODERNA), MRNA, LNP-S, PF, 50 MCG/0.5 ML (AGES 12+ YEARS)',
        administrationSite: 'RIGHT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: '4d4547fb-01f9-4c5e-b0e6-61d805ae6218',
      type: 'immunization',
      attributes: {
        cvxCode: 90662,
        date: '2023',
        doseNumber: 'BOOSTER',
        doseSeries: null,
        groupName: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        location: 'EVENING PRIMARY CARE',
        manufacturer: 'SANOFI PASTEUR',
        note: 'PATTY TEST',
        reaction: null,
        shortDescription: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        administrationSite: 'LEFT DELTOID',
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'M20875036619',
      type: 'immunization',
      attributes: {
        cvxCode: 90,
        date: '2016-04-04',
        doseNumber: 'Unknown',
        doseSeries: null,
        groupName: 'rabies vaccine, unspecified formulation',
        location: '556 Captain James A Lovell IL VA Medical Center',
        manufacturer: null,
        note: null,
        reaction: null,
        shortDescription: 'rabies vaccine, unspecified formulation',
        administrationSite: null,
        lotNumber: null,
        status: 'completed',
      },
    },
    {
      id: 'M20875036615',
      type: 'immunization',
      attributes: {
        cvxCode: 89,
        date: '1990-10-31',
        doseNumber: 'Unknown',
        doseSeries: null,
        groupName: 'poliovirus vaccine, unspecified',
        location: '556 Captain James A Lovell IL VA Medical Center',
        manufacturer: null,
        note: null,
        reaction: null,
        shortDescription: 'poliovirus vaccine, unspecified',
        administrationSite: null,
        lotNumber: null,
        status: 'completed',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 4,
      totalEntries: 31,
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
