const all = {
  entry: [
    // #####################################################################################
    // ##################################################################################### Blood Pressure
    // #####################################################################################
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2024-11-20T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2024-08-08T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2024-04-05T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2023-12-25T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2023-10-11T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2023-09-09T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2023-07-24T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2023-05-19T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2023-03-02T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2022-12-09T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2022-10-03T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2022-07-09T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2022-06-18T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2022-03-17T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-sysb-api.myhealth.va.gov/fhir/Observation/1009',
      resource: {
        id: '1009',
        meta: {
          versionId: '1',
          lastUpdated: '2024-11-20T16:37:38.150-05:00',
          source: '#B4IA3YLrUE461BJq',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.vitalsBP',
          ],
        },
        contained: [
          {
            id: 'Location-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'HospitalLocationTO.3669',
              },
            ],
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'VitalSignTO.6544837',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
            },
            {
              system: 'urn:oid:2.16.840.1.113883.6.233',
              code: '4500634',
              display: 'BLOOD PRESSURE',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        subject: {
          reference: 'Patient/1002',
        },
        effectiveDateTime: '2022-02-20T10:00:00-04:00',
        performer: [
          {
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
            display: 'ADTP BURNETT',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 120,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                },
              ],
            },
            valueQuantity: {
              value: 80,
              unit: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
        resourceType: 'Observation',
      },
      search: {
        mode: 'match',
      },
    },
    // #####################################################################################
    // ##################################################################################### Heart Rate
    // #####################################################################################
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-11-20T13:27:00-05:00',
        id: '2001',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 85,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-04-04T08:27:00-05:00',
        id: '2002',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 80,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-01-15T09:00:00-05:00',
        id: '2003',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 83,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-12-17T11:48:00-05:00',
        id: '2004',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 77,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-06-10T10:36:00-05:00',
        id: '2005',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 84,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-05-10T08:20:00-05:00',
        id: '2006',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 86,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-03-03T09:05:00-05:00',
        id: '2007',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 89,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-09T14:15:00-05:00',
        id: '2008',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 81,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-05T16:39:00-05:00',
        id: '2009',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8867-4',
              display: 'Heart rate',
            },
          ],
          text: 'PULSE',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 85,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-01-23T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    // #####################################################################################
    // ##################################################################################### Breathing rate
    // #####################################################################################
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 18,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-11-20T13:27:00-05:00',
        id: '2001',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 17,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-04-04T08:27:00-05:00',
        id: '2002',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 19,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-01-15T09:00:00-05:00',
        id: '2003',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 18,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-12-17T11:48:00-05:00',
        id: '2004',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 18,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-06-10T10:36:00-05:00',
        id: '2005',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 19,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-05-10T08:20:00-05:00',
        id: '2006',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 17,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-03-03T09:05:00-05:00',
        id: '2007',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 19,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-09T14:15:00-05:00',
        id: '2008',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 17,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-05T16:39:00-05:00',
        id: '2009',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '9279-1',
              display: 'Respiratory Rate',
            },
          ],
          text: 'RESPIRATION',
        },
        valueQuantity: {
          code: '/min',
          unit: '/min',
          value: 18,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-01-23T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    // #####################################################################################
    // ##################################################################################### Blood oxygen
    // #####################################################################################
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-11-20T13:27:00-05:00',
        id: '2001',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-04-04T08:27:00-05:00',
        id: '2002',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-01-15T09:00:00-05:00',
        id: '2003',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-12-17T11:48:00-05:00',
        id: '2004',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-06-10T10:36:00-05:00',
        id: '2005',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-05-10T08:20:00-05:00',
        id: '2006',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-03-03T09:05:00-05:00',
        id: '2007',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-09T14:15:00-05:00',
        id: '2008',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-05T16:39:00-05:00',
        id: '2009',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
          text: 'PULSE OXIMETRY',
        },
        valueQuantity: {
          code: '%',
          unit: '%',
          value: 99,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-01-23T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    // #####################################################################################
    // ##################################################################################### Temp
    // #####################################################################################
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 97.9,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-11-20T13:27:00-05:00',
        id: '2001',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.2,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-04-04T08:27:00-05:00',
        id: '2002',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.6,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-01-15T09:00:00-05:00',
        id: '2003',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 97.9,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-12-17T11:48:00-05:00',
        id: '2004',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 99.1,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-06-10T10:36:00-05:00',
        id: '2005',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.2,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-05-10T08:20:00-05:00',
        id: '2006',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.8,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-03-03T09:05:00-05:00',
        id: '2007',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.1,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-09T14:15:00-05:00',
        id: '2008',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.0,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-05T16:39:00-05:00',
        id: '2009',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8310-5',
              display: 'Body temperature',
            },
          ],
          text: 'TEMPERATURE',
        },
        valueQuantity: {
          code: '[degF]',
          unit: 'F',
          value: 98.2,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-01-23T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    // #####################################################################################
    // ##################################################################################### Weight
    // #####################################################################################
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 152,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-11-20T13:27:00-05:00',
        id: '2001',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 153,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-04-04T08:27:00-05:00',
        id: '2002',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 157,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-01-15T09:00:00-05:00',
        id: '2003',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 150,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-12-17T11:48:00-05:00',
        id: '2004',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 155,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-06-10T10:36:00-05:00',
        id: '2005',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 159,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-05-10T08:20:00-05:00',
        id: '2006',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 158,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-03-03T09:05:00-05:00',
        id: '2007',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 150,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-09T14:15:00-05:00',
        id: '2008',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 153,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-05T16:39:00-05:00',
        id: '2009',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '29463-7',
              display: 'Body weight',
            },
          ],
          text: 'WEIGHT',
        },
        valueQuantity: {
          code: '[lb_av]',
          unit: 'lb',
          value: 158,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-01-23T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    // #####################################################################################
    // ##################################################################################### Height
    // #####################################################################################
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-11-20T13:27:00-05:00',
        id: '2001',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-08-03T08:27:00-05:00',
        id: '2002',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-07-24T09:00:00-05:00',
        id: '2003',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-05-04T11:48:00-05:00',
        id: '2004',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-03-18T10:36:00-05:00',
        id: '2005',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-02-17T08:20:00-05:00',
        id: '2006',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2024-01-30T09:05:00-05:00',
        id: '2007',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-12-20T14:15:00-05:00',
        id: '2008',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-12-03T16:39:00-05:00',
        id: '2009',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-11-10T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-07-19T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-06-08T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-03-22T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-01-15T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-12-29T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-10-31T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-08-01T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-05-09T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-04-02T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-02-20T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-11-18T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-10-04T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-07-21T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-04-03T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2022-01-28T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-12-30T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-08-21T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-05-09T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2021-01-09T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-10-19T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-07-24T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-02-19T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2020-01-01T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-11-27T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-06-20T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-03-07T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2019-01-23T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2018-11-02T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 67.5,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2018-08-30T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        code: {
          coding: [
            {
              code: '8302-2',
              display: 'Body height',
            },
          ],
          text: 'HEIGHT',
        },
        valueQuantity: {
          code: '[in_i]',
          unit: 'in',
          value: 68,
        },
        contained: [
          {
            id: 'Location-0',
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2018-06-05T09:00:00-05:00',
        id: '20010',
        performer: [
          {
            extension: [
              {
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
      },
    },
    // #####################################################################################
    // #####################################################################################
    // #####################################################################################
  ],
};

module.exports = {
  all,
};
