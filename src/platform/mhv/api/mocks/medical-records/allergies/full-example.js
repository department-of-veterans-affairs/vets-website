const all = {
  resourceType: 'Bundle',
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance?patient=25000126&-pageToken=1~6adgB8FTpsGJGis',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzllL1Lvt',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzllL1Lvt',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '419474003',
              display: 'Allergy to mould',
            },
          ],
          text: 'Allergy to mould',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        note: [
          {
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to mould',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '419474003',
                  display: 'Allergy to mould',
                },
              ],
              text: 'Allergy to mould',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000005',
                    display: 'Inflammation of Skin',
                  },
                ],
                text: 'Inflammation of Skin',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlldBgG1',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlldBgG1',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '232350006',
              display: 'House dust mite allergy',
            },
          ],
          text: 'House dust mite allergy',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
              display: 'DR. JOHN248 SMITH811 MD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'House dust mite allergy',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '232350006',
                  display: 'House dust mite allergy',
                },
              ],
              text: 'House dust mite allergy',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000005',
                    display: 'Inflammation of Skin',
                  },
                ],
                text: 'Inflammation of Skin',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzllvM0a9',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzllvM0a9',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '232347008',
              display: 'Dander (animal) allergy',
            },
          ],
          text: 'Dander (animal) allergy',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
          display: 'DR. THOMAS359 REYNOLDS206 PHD',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
              display: 'DR. THOMAS359 REYNOLDS206 PHD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Dander (animal) allergy',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '232347008',
                  display: 'Dander (animal) allergy',
                },
              ],
              text: 'Dander (animal) allergy',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000001',
                    display: 'Sneezing and Coughing',
                  },
                ],
                text: 'Sneezing and Coughing',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlmDWKuH',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlmDWKuH',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '418689008',
              display: 'Allergy to grass pollen',
            },
          ],
          text: 'Allergy to grass pollen',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
          display: 'DR. THOMAS359 REYNOLDS206 PHD',
        },
        note: [
          {
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to grass pollen',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '418689008',
                  display: 'Allergy to grass pollen',
                },
              ],
              text: 'Allergy to grass pollen',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000005',
                    display: 'Inflammation of Skin',
                  },
                ],
                text: 'Inflammation of Skin',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlmVgfEP',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlmVgfEP',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '782576004',
              display: 'Allergy to tree pollen',
            },
          ],
          text: 'Allergy to tree pollen',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
              display: 'DR. THOMAS359 REYNOLDS206 PHD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to tree pollen',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '782576004',
                  display: 'Allergy to tree pollen',
                },
              ],
              text: 'Allergy to tree pollen',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000002',
                    display: 'Difficulty Breathing',
                  },
                ],
                text: 'Difficulty Breathing',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlmnqzYX',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlmnqzYX',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        category: ['food'],
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '420174000',
              display: 'Allergy to wheat',
            },
          ],
          text: 'Allergy to wheat',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
              display: 'DR. JOHN248 SMITH811 MD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to wheat',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '420174000',
                  display: 'Allergy to wheat',
                },
              ],
              text: 'Allergy to wheat',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000001',
                    display: 'Sneezing and Coughing',
                  },
                ],
                text: 'Sneezing and Coughing',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzln61Jsf',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzln61Jsf',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '300913006',
              display: 'Shellfish allergy',
            },
          ],
          text: 'Shellfish allergy',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQawlD29NjP',
              display: 'DR. JANE460 DOE922 MD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Shellfish allergy',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '300913006',
                  display: 'Shellfish allergy',
                },
              ],
              text: 'Shellfish allergy',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000001',
                    display: 'Sneezing and Coughing',
                  },
                ],
                text: 'Sneezing and Coughing',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlnOBeCn',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlnOBeCn',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '417532002',
              display: 'Allergy to fish',
            },
          ],
          text: 'Allergy to fish',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
              display: 'DR. THOMAS359 REYNOLDS206 PHD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to fish',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '417532002',
                  display: 'Allergy to fish',
                },
              ],
              text: 'Allergy to fish',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000003',
                    display: 'Itchy Watery Eyes',
                  },
                ],
                text: 'Itchy Watery Eyes',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlngLyWv',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlngLyWv',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        category: ['food'],
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '91934008',
              display: 'Allergy to nut',
            },
          ],
          text: 'Allergy to nut',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
              display: 'DR. THOMAS359 REYNOLDS206 PHD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to nut',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '91934008',
                  display: 'Allergy to nut',
                },
              ],
              text: 'Allergy to nut',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000002',
                    display: 'Difficulty Breathing',
                  },
                ],
                text: 'Difficulty Breathing',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzlnyWIr3',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzlnyWIr3',
        meta: {
          lastUpdated: '1942-07-20T00:02:59Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        type: 'allergy',
        category: ['food'],
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '91935009',
              display: 'Allergy to peanuts',
            },
          ],
          text: 'Allergy to peanuts',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '1942-07-20T00:02:59Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUqOa8ETaMEi3',
          display: 'DR. THOMAS359 REYNOLDS206 PHD',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
              display: 'DR. JOHN248 SMITH811 MD',
            },
            time: '1942-07-20T00:02:59Z',
            text: 'Allergy to peanuts',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '91935009',
                  display: 'Allergy to peanuts',
                },
              ],
              text: 'Allergy to peanuts',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '25000005',
                    display: 'Inflammation of Skin',
                  },
                ],
                text: 'Inflammation of Skin',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzoBMJC9x',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzoBMJC9x',
        meta: {
          lastUpdated: '2010-09-13T19:42:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '36437',
              display: 'Sertraline',
            },
          ],
          text: 'ZOLOFT 50MG TABLET',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '2010-09-13T19:42:00Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '36437',
                  display: 'Sertraline',
                },
              ],
              text: 'ZOLOFT 50MG TABLET',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '4637055',
                    display: 'ANAPHYLAXIS',
                  },
                ],
                text: 'ANAPHYLAXIS',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzoBeTWU5',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzoBeTWU5',
        meta: {
          lastUpdated: '2010-08-10T19:48:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'inactive',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '2670',
              display: 'Codeine',
            },
          ],
          text: 'CODEINE',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '2010-08-10T19:48:00Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '2670',
                  display: 'Codeine',
                },
              ],
              text: 'CODEINE',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '4637157',
                    display: 'ITCHING OF EYE',
                  },
                ],
                text: 'ITCHING OF EYE',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzoBwdqoD',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzoBwdqoD',
        meta: {
          lastUpdated: '2011-12-21T17:51:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '214442',
              display: 'Codeine / Guaifenesin',
            },
          ],
          text: 'CODEINE/GUAIFENESIN',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '2011-12-21T17:51:00Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '214442',
                  display: 'Codeine / Guaifenesin',
                },
              ],
              text: 'CODEINE/GUAIFENESIN',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '4538635',
                    display: 'RASH',
                  },
                ],
                text: 'RASH',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzoCEoB8L',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzoCEoB8L',
        meta: {
          lastUpdated: '2011-11-30T21:30:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '2193',
              display: 'Ceftriaxone',
            },
          ],
          text: 'ROCEPHIN',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '2011-11-30T21:30:00Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
              display: 'DR. JOHN248 SMITH811 MD',
            },
            time: '2011-11-30T21:31:30Z',
            text:
              'Patient says difficulty breathing, but did not go tohospital.',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '2193',
                  display: 'Ceftriaxone',
                },
              ],
              text: 'ROCEPHIN',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '4637470',
                    display: 'DYSPNEA',
                  },
                ],
                text: 'DYSPNEA',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-7SGHnrsAuBIzoCWyVST',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-7SGHnrsAuBIzoCWyVST',
        meta: {
          lastUpdated: '2010-08-10T19:48:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'inactive',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '2670',
              display: 'Codeine',
            },
          ],
          text: 'CODEINE',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/25000126',
          display: 'Mr. Lorenzo669 Valentín837',
        },
        recordedDate: '2010-08-10T19:48:00Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Ufekf9eGUfQZLR7LNfJT',
          display: 'DR. JOHN248 SMITH811 MD',
        },
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '2670',
                  display: 'Codeine',
                },
              ],
              text: 'CODEINE',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '4637157',
                    display: 'ITCHING OF EYE',
                  },
                ],
                text: 'ITCHING OF EYE',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

const single = (req, res) => {
  const { id } = req.params;
  const response = all.entry.find(item => {
    return item.resource.id === id;
  });
  return res.json(response ? response.resource : {});
};

module.exports = {
  all,
  single,
};
