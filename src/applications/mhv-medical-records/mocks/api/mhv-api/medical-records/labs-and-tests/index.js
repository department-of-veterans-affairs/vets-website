const all = {
  resourceType: 'Bundle',
  id: '8d8b7708-da2e-41f6-90ec-12b8477635f1',
  meta: {
    lastUpdated: '2024-05-31T11:21:05.570-04:00',
  },
  type: 'searchset',
  total: 7,
  link: [
    {
      relation: 'self',
      url:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport?patient=4130',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '6258114',
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            type: {
              text: 'Blood',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Beth M. Smith',
                family: 'Smith',
                given: ['Beth', 'M.'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Complete blood count',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12340',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'WBC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 5.5,
              unit: 'bil/L',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.2 - 10.6',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12341',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'RBC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 5.0,
              unit: 'tril/L',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.5 - 5.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12342',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'HGB',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 12.4,
              unit: 'g/dL',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '13.6 - 17.0',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12343',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'HCT',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 40.9,
              unit: '%',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '41 - 51',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12344',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'MCV',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 82,
              unit: 'fL',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '82 - 100',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12345',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'ACK',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 5.0,
              unit: 'K/ccm',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.5 - 10.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12346',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'MCHC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 30,
              unit: 'g/dL',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '32 - 36',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12347',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'RDW',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 15,
              unit: '%',
            },
            interpretation: [
              {
                text: 'H',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '12 - 14.2',
              },
            ],
          },
        ],
        extension: [
          {
            valueString: "Pat Wilsons' blood panel is standard",
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2024-12-12T09:00:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12340',
          },
          {
            reference: '#12341',
          },
          {
            reference: '#12342',
          },
          {
            reference: '#12343',
          },
          {
            reference: '#12344',
          },
          {
            reference: '#12345',
          },
          {
            reference: '#12346',
          },
          {
            reference: '#12347',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '6258223',
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            type: {
              text: 'Blood',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Beth M. Smith',
                family: 'Smith',
                given: ['Beth', 'M.'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Complete blood count',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12350',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'WBC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 5.3,
              unit: 'bil/L',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.2 - 10.6',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12351',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'RBC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 5.07,
              unit: 'tril/L',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.5 - 5.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12352',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'HGB',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 12.8,
              unit: 'g/dL',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '13.6 - 17.0',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12353',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'HCT',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 41.0,
              unit: '%',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '41 - 51',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12354',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'MCV',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 81,
              unit: 'fL',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '82 - 100',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12355',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'ACK',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 5.0,
              unit: 'K/ccm',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.5 - 10.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12356',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'MCHC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 31,
              unit: 'g/dL',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '32 - 36',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12357',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'RDW',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 15,
              unit: '%',
            },
            interpretation: [
              {
                text: 'H',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '12 - 14.2',
              },
            ],
          },
        ],
        extension: [
          {
            valueString: "Pat Wilsons' blood panel is standard",
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2024-11-15T09:30:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12350',
          },
          {
            reference: '#12351',
          },
          {
            reference: '#12352',
          },
          {
            reference: '#12353',
          },
          {
            reference: '#12354',
          },
          {
            reference: '#12355',
          },
          {
            reference: '#12356',
          },
          {
            reference: '#12357',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/12321',
      resource: {
        resourceType: 'DocumentReference',
        id: '1234567',
        meta: {
          profile: [
            'https://johnmoehrke.github.io/MHV-PHR/StructureDefinition/VA.MHV.PHR.ecg',
          ],
        },
        text: {
          status: 'generated',
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Generated Narrative: DocumentReference</b><a name="ex-MHV-ecg-0"> </a></p><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px">Resource DocumentReference &quot;ex-MHV-ecg-0&quot; </p><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-VA.MHV.PHR.ecg.html">VA MHV PHR ECG</a></p></div><p><b>identifier</b>: id: ClinicalProcedureTO.41359 (use: USUAL)</p><p><b>status</b>: current</p><p><b>type</b>: EKG study <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="https://loinc.org/">LOINC</a>#11524-6)</span></p><p><b>category</b>: Cardiology <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="https://loinc.org/">LOINC</a>#LP29708-2)</span>, Clinical Note <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="http://hl7.org/fhir/us/core/STU5.0.1/CodeSystem-us-core-documentreference-category.html">US Core DocumentReferences Category Codes</a>#clinical-note)</span></p><p><b>subject</b>: <a href="Patient-ex-MHV-patient-1.html">Patient/ex-MHV-patient-1</a> &quot; DAYTSHR&quot;</p><p><b>date</b>: Dec 14, 2000, 5:35:00 AM</p><blockquote><p><b>content</b></p><h3>Attachments</h3><table class="grid"><tr><td>-</td><td><b>ContentType</b></td><td><b>Data</b></td><td><b>Title</b></td></tr><tr><td>*</td><td>text/plain</td><td>UGcuIDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwOS8xMi8yMiAxMDoxMQogICAgICAgICAgICAgICAgICAgICAgICAgICBDT05GSURFTlRJQUwgRUNHIFJFUE9SVCAgICAgICAgICAgICAgICAgICAgICAgICAgICAKTUhWTElTQU9ORSxST0JFUlQgTSAgICA2NjYtMTItMzQ1NiAgIE5PVCBJTlBBVElFTlQgICAgICAgICAgICAgIERPQjogQVVHIDksMTk2MgogICAgICAgICAgICAgICAgICAgICAgUFJPQ0VEVVJFIERBVEUvVElNRTogMTIvMTQvMDAgMTE6MzUKLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXQVJEL0NMSU5JQzogQ0FSRElPTE9HWSBPVVRQQVRJRU5UIChMT0MpCiAgICBBR0U6IDM4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0VYOiAgTUFMRQogICAgSFQgSU46IDA3MSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdUIExCUzogMTU0CiAgICBCTE9PRCBQUkVTU1VSRTogICAgICAgICAgICAgICAgICAgICAgICAgVFlQRTogCgogICAgICAgICBWRU5UIFJBVEU6IDA4NiAgICAgICAgUFIgSU5URVJWQUw6IDEzMiAgICAgICBRUlMgRFVSQVRJT046IDEzMgogICAgICAgICBRVDogMzg4ICAgICAgICAgICAgICAgUVRDOiA0NjQKICAgICAgICAgUCBBWElTOiAxMTIgICAgICAgICAgIFIgQVhJUzogNzAgICAgICAgICAgICAgVCBBWElTOiAxNDgKCiAgICBJTlRFUlBSRVRBVElPTjogCgogICAgSU5TVFJVTUVOVCBEWDogIE5vcm1hbCBzaW51cyByaHl0aG0KICAgICAgICAgICAgICAgICAgICBSaWdodCBidW5kbGUgYnJhbmNoIGJsb2NrCiAgICAgICAgICAgICAgICAgICAgTGF0ZXJhbCBpbmZhcmN0ICwgYWdlIHVuZGV0ZXJtaW5lZAogICAgICAgICAgICAgICAgICAgIFBvc3NpYmxlIEluZmVyaW9yIGluZmFyY3QgKGNpdGVkIG9uIG9yIGJlZm9yZSAzMS1KVUwtMjAwMCkKICAgICAgICAgICAgICAgICAgICBBYm5vcm1hbCBFQ0cKICAgICAgICAgICAgICAgICAgICAuCiAgICAgICAgICAgICAgICAgICAgLgogICAgICAgICAgICAgICAgICAgIC4KCiAgICBDT05GSVJNQVRJT04gU1RBVFVTOiBDT05GSVJNRUQKCiAgICBDT01QQVJJU09OOiAKIAoKICAgIENPTU1FTlRTOiAKCiAgICBIRUFSVCBNRURTOgoKICAgIElOVEVSUFJFVEVEIEJZOiBHVVBUQSxTQVRZRU5EUkE=</td><td>ELECTROCARDIOGRAM</td></tr></table></blockquote><h3>Contexts</h3><table class="grid"><tr><td>-</td><td><b>Related</b></td></tr><tr><td>*</td><td><a href="Location-ex-MHV-location-989.html">Location/ex-MHV-location-989</a> &quot;DAYT29 TEST LAB&quot;</td></tr></table></div>',
        },
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
            value: 'ClinicalProcedureTO.41359',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11524-6',
            },
          ],
        },
        category: [
          {
            coding: [
              {
                system: 'http://loinc.org',
                code: 'LP29708-2',
              },
            ],
          },
          {
            coding: [
              {
                system:
                  'http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category',
                code: 'clinical-note',
              },
            ],
          },
        ],
        subject: {
          reference: 'Patient/ex-MHV-patient-1',
        },
        date: '2024-11-02T10:00:00-05:00',
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'UGcuIDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwOS8xMi8yMiAxMDoxMQogICAgICAgICAgICAgICAgICAgICAgICAgICBDT05GSURFTlRJQUwgRUNHIFJFUE9SVCAgICAgICAgICAgICAgICAgICAgICAgICAgICAKTUhWTElTQU9ORSxST0JFUlQgTSAgICA2NjYtMTItMzQ1NiAgIE5PVCBJTlBBVElFTlQgICAgICAgICAgICAgIERPQjogQVVHIDksMTk2MgogICAgICAgICAgICAgICAgICAgICAgUFJPQ0VEVVJFIERBVEUvVElNRTogMTIvMTQvMDAgMTE6MzUKLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXQVJEL0NMSU5JQzogQ0FSRElPTE9HWSBPVVRQQVRJRU5UIChMT0MpCiAgICBBR0U6IDM4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0VYOiAgTUFMRQogICAgSFQgSU46IDA3MSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdUIExCUzogMTU0CiAgICBCTE9PRCBQUkVTU1VSRTogICAgICAgICAgICAgICAgICAgICAgICAgVFlQRTogCgogICAgICAgICBWRU5UIFJBVEU6IDA4NiAgICAgICAgUFIgSU5URVJWQUw6IDEzMiAgICAgICBRUlMgRFVSQVRJT046IDEzMgogICAgICAgICBRVDogMzg4ICAgICAgICAgICAgICAgUVRDOiA0NjQKICAgICAgICAgUCBBWElTOiAxMTIgICAgICAgICAgIFIgQVhJUzogNzAgICAgICAgICAgICAgVCBBWElTOiAxNDgKCiAgICBJTlRFUlBSRVRBVElPTjogCgogICAgSU5TVFJVTUVOVCBEWDogIE5vcm1hbCBzaW51cyByaHl0aG0KICAgICAgICAgICAgICAgICAgICBSaWdodCBidW5kbGUgYnJhbmNoIGJsb2NrCiAgICAgICAgICAgICAgICAgICAgTGF0ZXJhbCBpbmZhcmN0ICwgYWdlIHVuZGV0ZXJtaW5lZAogICAgICAgICAgICAgICAgICAgIFBvc3NpYmxlIEluZmVyaW9yIGluZmFyY3QgKGNpdGVkIG9uIG9yIGJlZm9yZSAzMS1KVUwtMjAwMCkKICAgICAgICAgICAgICAgICAgICBBYm5vcm1hbCBFQ0cKICAgICAgICAgICAgICAgICAgICAuCiAgICAgICAgICAgICAgICAgICAgLgogICAgICAgICAgICAgICAgICAgIC4KCiAgICBDT05GSVJNQVRJT04gU1RBVFVTOiBDT05GSVJNRUQKCiAgICBDT01QQVJJU09OOiAKIAoKICAgIENPTU1FTlRTOiAKCiAgICBIRUFSVCBNRURTOgoKICAgIElOVEVSUFJFVEVEIEJZOiBHVVBUQSxTQVRZRU5EUkE=',
              title: 'ELECTROCARDIOGRAM',
            },
          },
        ],
        context: {
          related: [
            {
              reference: 'Location/ex-MHV-location-989',
            },
          ],
        },
      },
      search: { mode: 'match' },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/12321',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '1234561',
        meta: {
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.MBlabReport',
          ],
        },
        text: {
          status: 'generated',
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><h2><span title="Codes:{http://loinc.org 18725-2}">LR MICROBIOLOGY REPORT</span> (<span title="Codes:{http://terminology.hl7.org/CodeSystem/v2-0074 LAB}">Laboratory</span>, <span title="Codes:{http://terminology.hl7.org/CodeSystem/v2-0074 MB}">Microbiology</span>) </h2><table class="grid"><tr><td>Subject</td><td><b>MTPZEROTWO DAYTSHR </b> male, DoB: 1000-01-01 ( <code>urn:oid:2.16.840.1.113883.4.349</code>/1 (use: usual))</td></tr><tr><td>When For</td><td>1995-08-01 11:07:00+0000</td></tr><tr><td>Reported</td><td>1995-08-01 11:07:00+0000</td></tr><tr><td>Identifier:</td><td> <code>urn:oid:2.16.840.1.113883.4.349.4.989</code>/LabReportTO.MI;7049271 (use: usual)</td></tr></table><p><b>Report Details</b></p><table class="grid"><tr><td><b>Code</b></td><td><b>Value</b></td><td><b>When For</b></td></tr><tr><td><a href="#ex-MHV-labTest-5"><span title="Codes:">Parasitology Remark(s)</span></a></td><td>REJECTED=LEAKED</td><td>1995-08-01 11:07:00+0000</td></tr><tr><td><a href="#ex-MHV-labTest-6"><span title="Codes:">Parasitology Remark(s)</span></a></td><td>MODERATE WBC\'S SEEN</td><td>1995-08-01 11:07:00+0000</td></tr><tr><td><a href="#ex-MHV-labTest-7"><span title="Codes:">Parasitology Remark(s)</span></a></td><td>MODERATE YEAST</td><td>1995-08-01 11:07:00+0000</td></tr></table></div>',
        },
        contained: [
          {
            resourceType: 'Observation',
            id: '12360',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.labTest',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
                value: 'LabTestTO.MI;7049271;1',
              },
            ],
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'laboratory',
                  },
                ],
              },
            ],
            code: {
              text: 'Parasitology Remark(s)',
            },
            subject: {
              reference: 'Patient/ex-MHV-patient-1',
            },
            effectiveDateTime: '1995-08-01T11:07:00Z',
            performer: [
              {
                reference: '#ex-MHV-organization-989',
              },
            ],
            valueString: 'REJECTED=LEAKED',
          },
          {
            resourceType: 'Observation',
            id: '12361',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.labTest',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
                value: 'LabTestTO.MI;7049271;2',
              },
            ],
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'laboratory',
                  },
                ],
              },
            ],
            code: {
              text: 'Parasitology Remark(s)',
            },
            subject: {
              reference: 'Patient/ex-MHV-patient-1',
            },
            effectiveDateTime: '1995-08-01T11:07:00Z',
            performer: [
              {
                reference: '#ex-MHV-organization-989',
              },
            ],
            valueString: "MODERATE WBC'S SEEN",
          },
          {
            resourceType: 'Observation',
            id: '12362',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.labTest',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
                value: 'LabTestTO.MI;7049271;3',
              },
            ],
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'laboratory',
                  },
                ],
              },
            ],
            code: {
              text: 'Parasitology Remark(s)',
            },
            subject: {
              reference: 'Patient/ex-MHV-patient-1',
            },
            effectiveDateTime: '1995-08-01T11:07:00Z',
            performer: [
              {
                reference: '#ex-MHV-organization-989',
              },
            ],
            valueString: 'MODERATE YEAST',
          },
          {
            resourceType: 'Specimen',
            id: 'ex-MHV-specimen-3',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.LabSpecimen',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
                value: 'LabSpecimenTO.6Y100',
              },
            ],
            accessionIdentifier: {
              use: 'usual',
              system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
              value: 'PARAS 95 262',
            },
            status: 'available',
            type: {
              text: 'Blood',
            },
            collection: {
              collectedDateTime: '2024-11-02T09:30:00-05:00',
              bodySite: {
                text: 'Blood',
              },
            },
          },
          {
            resourceType: 'Organization',
            id: 'ex-MHV-organization-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: 'LabSiteTO.989',
              },
              {
                system: 'http://hl7.org/fhir/sid/us-npi',
                value: '1234',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-mangas',
            meta: {
              profile: [
                'http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner',
              ],
            },
            identifier: [
              {
                system: 'http://nowhere.com/nope',
                value: 'unknown',
              },
            ],
            name: [
              {
                text: 'Gregory House, M.D.',
                family: 'House',
              },
            ],
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
            value: 'LabReportTO.MI;7049271',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'MB',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '18725-2',
            },
          ],
          text: 'Microbiology',
        },
        subject: {
          reference: 'Patient/ex-MHV-patient-1',
        },
        effectiveDateTime: '2024-11-02T09:30:00-05:00',
        issued: '2021-01-20T16:38:59-05:00',
        performer: [
          {
            reference: '#ex-MHV-organization-989',
          },
          {
            reference: '#ex-MHV-practitioner-mangas',
          },
        ],
        specimen: [
          {
            reference: '#ex-MHV-specimen-3',
          },
        ],
        result: [
          {
            reference: '#12360',
          },
          {
            reference: '#12361',
          },
          {
            reference: '#12362',
          },
        ],
        presentedForm: [
          {
            contentType: 'text/plain',
            data:
              'QWNjZXNzaW9uIFtVSURdOiBNSSAxNiAzMDY1IFsxMjE2MDAzMDY1XSBSZWNlaXZlZDogTm92IDIsIDIwMjRAMDk6MzAKQ29sbGVjdGlvbiBzYW1wbGU6IFZFTk9VUyBCTE9PRCBDb2xsZWN0aW9uIGRhdGU6IE5vdiAyLCAyMDI0IDk6MzAKU2l0ZS9TcGVjaW1lbjogQkxPT0QgVkVOT1VTClByb3ZpZGVyOiBXSUxTT04sIFBBVAoKKiBCQUNURVJJT0xPR1kgRklOQUwgUkVQT1JUID0+IE5vdiAyLCAyMDI0IDA5OjMwIFRFQ0ggQ09ERTogMjA1OTMxCkNVTFRVUkUgUkVTVUxUUzogRVNDSEVSSUNISUEgQ09MSSAtIFF1YW50aXR5OiAyKwpBTlRJQklPVElDIFNVU0NFUFRJQklMSVRZIFRFU1QgUkVTVUxUUzoKRVNDSEVSSUNISUEgQ09MSQo6CkFNUElDSUxMSU4uLi4uLi4uLi4uLi4uLi4uLi4uLiBTCkFNUElDSUxMSU4vU1VMQkFDVEFNLi4uLi4uLi4uLiBTCkNFRkFaT0xJTi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBTClRPQlJNQ04uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBTCkdFTlRNQ04uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBTCkNFRlRSSUFYT05FLi4uLi4uLi4uLi4uLi4uLi4uLiBTCkNJUFJPRkxPWEFDSU4uLi4uLi4uLi4uLi4uLi4uLiBTCkFNT1hJQ0lMTElOL0NMQVZVTEFOQVRFLi4uLi4uLiBTClRSSU1FVEgvU1VMRi4uLi4uLi4uLi4uLi4uLi4uLiBTCkxFVk9GTE9YQUNJTi4uLi4uLi4uLi4uLi4uLi4uLiBTCgo9LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS09LS0KUGVyZm9ybWluZyBMYWJvcmF0b3J5OgpCYWN0ZXJpb2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeToKV2FzaGluZ3RvbiBEQyBWQU1DCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tClJlc3VsdCBLZXk6ClNVU0MgPSBTdXNjZXB0aWJpbGl0eSBSZXN1bHQgUyA9IFN1c2NlcHRpYmxlCklOVFAgPSBJbnRlcnByZXRhdGlvbiBJID0gSW50ZXJtZWRpYXRlCk1JQyA9IE1pbmltdW0gSW5oaWJpdG9yeSBDb25jZW50cmF0aW9uIFIgPSBSZXNpc3RhbnQ=',
          },
        ],
      },
      search: { mode: 'match' },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '62585',
        meta: {
          versionId: '1',
          lastUpdated: '2024-05-21T15:39:30.126-04:00',
          source: '#byyVtiRCKRE6yvwG',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chReport',
          ],
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chSpecimen',
              ],
            },
            status: 'available',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0487',
                  code: 'SER',
                  display: 'Serum',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/61',
                  version: '5.2',
                  code: '72',
                  display: 'SERUM',
                },
              ],
              text: 'Serum (substance)',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Beth M. Smith',
                family: 'Smith',
                given: ['Beth', 'M.'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Metabolic Panel',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12370',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'BUN',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 21,
              unit: 'MG/DL',
            },
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '7.8 - 21.4',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12371',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'CALCIUM',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 8.7,
              unit: 'MG/DL',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: 'Result is low when compared to reference range',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '8.8 - 10.2',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12372',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'CREATININE (SERUM)',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 1.1,
              unit: 'mg/dL',
            },
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '0.7 - 1.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12373',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'POTASSIUM',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 4.0,
              unit: 'mmol/l',
            },
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '3.5 - 5.1',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12374',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'CHLORIDE',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 102,
              unit: 'mmol/l',
            },
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '98 - 107',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12375',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'SODIUM',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 161,
              unit: 'mmol/l',
            },
            interpretation: [
              {
                text: 'HH',
              },
            ],
            note: [
              {
                text: 'Result is citically high when compared to ref. range.',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '136 - 145',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12376',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'CO2',
            },
            valueQuantity: {
              value: 26,
              unit: 'mmol/l',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '21 - 32',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12377',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'GLUCOSE',
            },
            valueQuantity: {
              value: 49,
              unit: 'MG/DL',
            },
            interpretation: [
              {
                text: 'LL',
              },
            ],
            note: [
              {
                text: 'Result is critically low when compared to ref. range.',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '70 - 110',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12378',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'EGFR',
            },
            valueQuantity: {
              value: '>60',
              unit: 'mL/min',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text:
                  'The following conditions may alter the eGFR result: severe malnutrition or obesity, skeletal muscle disease and rapidly changing kidney function.',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '>60',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12379',
            status: 'Final',
            code: {
              text: 'ANION GAP',
            },
            valueQuantity: {
              value: '13',
              unit: 'mmol/l',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: '5 - 16',
              },
            ],
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2024-09-18T08:00:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12370',
          },
          {
            reference: '#12371',
          },
          {
            reference: '#12372',
          },
          {
            reference: '#12373',
          },
          {
            reference: '#12374',
          },
          {
            reference: '#12375',
          },
          {
            reference: '#12376',
          },
          {
            reference: '#12377',
          },
          {
            reference: '#12378',
          },
          {
            reference: '#12379',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/12321',
      resource: {
        physician: 'Gregory House, M.D.',
        resourceType: 'DiagnosticReport',
        id: '1234562',
        meta: {
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.SPlabReport',
          ],
        },
        text: {
          status: 'generated',
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><h2><span title="Codes:{http://loinc.org 11526-1}">LR SURGICAL PATHOLOGY REPORT</span> (<span title="Codes:{http://terminology.hl7.org/CodeSystem/v2-0074 LAB}">Laboratory</span>, <span title="Codes:{http://terminology.hl7.org/CodeSystem/v2-0074 SP}">Surgical Pathology</span>) </h2><table class="grid"><tr><td>Subject</td><td><b>MTPZEROTWO DAYTSHR </b> male, DoB: 1000-01-01 ( <code>urn:oid:2.16.840.1.113883.4.349</code>/1 (use: usual))</td></tr><tr><td>When For</td><td>1999-08-11 16:09:00+0000</td></tr><tr><td>Reported</td><td>1999-08-11 16:09:00+0000</td></tr><tr><td>Identifier:</td><td> <code>urn:oid:2.16.840.1.113883.4.349.4.989</code>/LabReportTO.SP;7009190 (use: usual)</td></tr></table><p><b>Report Details</b></p></div>',
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'ex-MHV-specimen-6',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.LabSpecimen',
              ],
            },
            accessionIdentifier: {
              use: 'usual',
              system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
              value: 'SP 99 1804',
            },
            status: 'available',
            collection: {
              collectedDateTime: '2024-08-27T12:54:00-0500',
            },
          },
          {
            resourceType: 'Organization',
            id: 'ex-MHV-organization-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: 'LabSiteTO.989',
              },
              {
                system: 'http://hl7.org/fhir/sid/us-npi',
                value: '1234',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
            value: 'LabReportTO.SP;7009190',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'SP',
              },
            ],
            text: 'Chemistry and hematology',
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11526-1',
            },
          ],
          text: 'Cytology',
        },
        subject: {
          reference: 'Patient/ex-MHV-patient-1',
        },
        effectiveDateTime: '2024-08-27T12:54:00-0500',
        issued: '1999-08-11T16:09:00Z',
        performer: [
          {
            reference: '#ex-MHV-organization-989',
          },
        ],
        specimen: [
          {
            reference: '#ex-MHV-specimen-6',
          },
        ],
        presentedForm: [
          {
            contentType: 'text/plain',
            data:
              'RGF0ZSBTcGVjIHRha2VuOiBEZWMgMjEsIDIwMjEgMTI6NTQgUGF0aG9sb2dpc3Q6IENIRVJZTCBKQU1FUwpEYXRlIFNwZWMgcmVjJ2Q6IERlYyAyMSwgMjAyMSAxMjo1NSBUZWNoOiBDSEVSWUwgSkFNRVMKRGF0ZSBjb21wbGV0ZWQ6IERlYyAyMSwgMjAyMSBBY2Nlc3Npb24gIzogQ1kgMTQgOTk5OTk4ClN1Ym1pdHRlZCBieTogR1JFR09SWSBIT1VTRSwgTS5ELiBQcmFjdGl0aW9uZXI6IFNBTkRSQSBERU5UT04KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQpTcGVjaW1lbjoKRkxVSUQKREVTQ1JJUFRJT046ClRoaXMgaXMgdGhlIE5hdGlvbmFsIHBhY2thZ2UgLSB0ZXN0aW5nIGZvciBNSFYuCk1JQ1JPU0NPUElDIEVYQU0gKERhdGUgU3BlYyB0YWtlbjogRGVjIDIxLCAyMDIxIDEyOjU0KQpOb3JtYWwgZmx1aWQgLSBURVNUIE9OTFkKPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tClBlcmZvcm1pbmcgTGFib3JhdG9yeToKQ3l0b2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeToKV0FTSElOR1RJT04gREMgVkFNQw==',
          },
        ],
      },
      search: { mode: 'match' },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/12321',
      resource: {
        resourceType: 'DocumentReference',
        id: '1234563',
        meta: {
          profile: [
            'https://johnmoehrke.github.io/MHV-PHR/StructureDefinition/VA.MHV.PHR.ecg',
          ],
        },
        text: {
          status: 'generated',
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Generated Narrative: DocumentReference</b><a name="ex-MHV-ecg-0"> </a></p><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px">Resource DocumentReference &quot;ex-MHV-ecg-0&quot; </p><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-VA.MHV.PHR.ecg.html">VA MHV PHR ECG</a></p></div><p><b>identifier</b>: id: ClinicalProcedureTO.41359 (use: USUAL)</p><p><b>status</b>: current</p><p><b>type</b>: EKG study <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="https://loinc.org/">LOINC</a>#11524-6)</span></p><p><b>category</b>: Cardiology <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="https://loinc.org/">LOINC</a>#LP29708-2)</span>, Clinical Note <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="http://hl7.org/fhir/us/core/STU5.0.1/CodeSystem-us-core-documentreference-category.html">US Core DocumentReferences Category Codes</a>#clinical-note)</span></p><p><b>subject</b>: <a href="Patient-ex-MHV-patient-1.html">Patient/ex-MHV-patient-1</a> &quot; DAYTSHR&quot;</p><p><b>date</b>: Dec 14, 2000, 5:35:00 AM</p><blockquote><p><b>content</b></p><h3>Attachments</h3><table class="grid"><tr><td>-</td><td><b>ContentType</b></td><td><b>Data</b></td><td><b>Title</b></td></tr><tr><td>*</td><td>text/plain</td><td>UGcuIDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwOS8xMi8yMiAxMDoxMQogICAgICAgICAgICAgICAgICAgICAgICAgICBDT05GSURFTlRJQUwgRUNHIFJFUE9SVCAgICAgICAgICAgICAgICAgICAgICAgICAgICAKTUhWTElTQU9ORSxST0JFUlQgTSAgICA2NjYtMTItMzQ1NiAgIE5PVCBJTlBBVElFTlQgICAgICAgICAgICAgIERPQjogQVVHIDksMTk2MgogICAgICAgICAgICAgICAgICAgICAgUFJPQ0VEVVJFIERBVEUvVElNRTogMTIvMTQvMDAgMTE6MzUKLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXQVJEL0NMSU5JQzogQ0FSRElPTE9HWSBPVVRQQVRJRU5UIChMT0MpCiAgICBBR0U6IDM4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0VYOiAgTUFMRQogICAgSFQgSU46IDA3MSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdUIExCUzogMTU0CiAgICBCTE9PRCBQUkVTU1VSRTogICAgICAgICAgICAgICAgICAgICAgICAgVFlQRTogCgogICAgICAgICBWRU5UIFJBVEU6IDA4NiAgICAgICAgUFIgSU5URVJWQUw6IDEzMiAgICAgICBRUlMgRFVSQVRJT046IDEzMgogICAgICAgICBRVDogMzg4ICAgICAgICAgICAgICAgUVRDOiA0NjQKICAgICAgICAgUCBBWElTOiAxMTIgICAgICAgICAgIFIgQVhJUzogNzAgICAgICAgICAgICAgVCBBWElTOiAxNDgKCiAgICBJTlRFUlBSRVRBVElPTjogCgogICAgSU5TVFJVTUVOVCBEWDogIE5vcm1hbCBzaW51cyByaHl0aG0KICAgICAgICAgICAgICAgICAgICBSaWdodCBidW5kbGUgYnJhbmNoIGJsb2NrCiAgICAgICAgICAgICAgICAgICAgTGF0ZXJhbCBpbmZhcmN0ICwgYWdlIHVuZGV0ZXJtaW5lZAogICAgICAgICAgICAgICAgICAgIFBvc3NpYmxlIEluZmVyaW9yIGluZmFyY3QgKGNpdGVkIG9uIG9yIGJlZm9yZSAzMS1KVUwtMjAwMCkKICAgICAgICAgICAgICAgICAgICBBYm5vcm1hbCBFQ0cKICAgICAgICAgICAgICAgICAgICAuCiAgICAgICAgICAgICAgICAgICAgLgogICAgICAgICAgICAgICAgICAgIC4KCiAgICBDT05GSVJNQVRJT04gU1RBVFVTOiBDT05GSVJNRUQKCiAgICBDT01QQVJJU09OOiAKIAoKICAgIENPTU1FTlRTOiAKCiAgICBIRUFSVCBNRURTOgoKICAgIElOVEVSUFJFVEVEIEJZOiBHVVBUQSxTQVRZRU5EUkE=</td><td>ELECTROCARDIOGRAM</td></tr></table></blockquote><h3>Contexts</h3><table class="grid"><tr><td>-</td><td><b>Related</b></td></tr><tr><td>*</td><td><a href="Location-ex-MHV-location-989.html">Location/ex-MHV-location-989</a> &quot;DAYT29 TEST LAB&quot;</td></tr></table></div>',
        },
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
            value: 'ClinicalProcedureTO.41359',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11524-6',
            },
          ],
        },
        category: [
          {
            coding: [
              {
                system: 'http://loinc.org',
                code: 'LP29708-2',
              },
            ],
          },
          {
            coding: [
              {
                system:
                  'http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category',
                code: 'clinical-note',
              },
            ],
          },
        ],
        subject: {
          reference: 'Patient/ex-MHV-patient-1',
        },
        date: '2024-03-07T10:00:00-05:00',
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'UGcuIDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwOS8xMi8yMiAxMDoxMQogICAgICAgICAgICAgICAgICAgICAgICAgICBDT05GSURFTlRJQUwgRUNHIFJFUE9SVCAgICAgICAgICAgICAgICAgICAgICAgICAgICAKTUhWTElTQU9ORSxST0JFUlQgTSAgICA2NjYtMTItMzQ1NiAgIE5PVCBJTlBBVElFTlQgICAgICAgICAgICAgIERPQjogQVVHIDksMTk2MgogICAgICAgICAgICAgICAgICAgICAgUFJPQ0VEVVJFIERBVEUvVElNRTogMTIvMTQvMDAgMTE6MzUKLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXQVJEL0NMSU5JQzogQ0FSRElPTE9HWSBPVVRQQVRJRU5UIChMT0MpCiAgICBBR0U6IDM4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0VYOiAgTUFMRQogICAgSFQgSU46IDA3MSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdUIExCUzogMTU0CiAgICBCTE9PRCBQUkVTU1VSRTogICAgICAgICAgICAgICAgICAgICAgICAgVFlQRTogCgogICAgICAgICBWRU5UIFJBVEU6IDA4NiAgICAgICAgUFIgSU5URVJWQUw6IDEzMiAgICAgICBRUlMgRFVSQVRJT046IDEzMgogICAgICAgICBRVDogMzg4ICAgICAgICAgICAgICAgUVRDOiA0NjQKICAgICAgICAgUCBBWElTOiAxMTIgICAgICAgICAgIFIgQVhJUzogNzAgICAgICAgICAgICAgVCBBWElTOiAxNDgKCiAgICBJTlRFUlBSRVRBVElPTjogCgogICAgSU5TVFJVTUVOVCBEWDogIE5vcm1hbCBzaW51cyByaHl0aG0KICAgICAgICAgICAgICAgICAgICBSaWdodCBidW5kbGUgYnJhbmNoIGJsb2NrCiAgICAgICAgICAgICAgICAgICAgTGF0ZXJhbCBpbmZhcmN0ICwgYWdlIHVuZGV0ZXJtaW5lZAogICAgICAgICAgICAgICAgICAgIFBvc3NpYmxlIEluZmVyaW9yIGluZmFyY3QgKGNpdGVkIG9uIG9yIGJlZm9yZSAzMS1KVUwtMjAwMCkKICAgICAgICAgICAgICAgICAgICBBYm5vcm1hbCBFQ0cKICAgICAgICAgICAgICAgICAgICAuCiAgICAgICAgICAgICAgICAgICAgLgogICAgICAgICAgICAgICAgICAgIC4KCiAgICBDT05GSVJNQVRJT04gU1RBVFVTOiBDT05GSVJNRUQKCiAgICBDT01QQVJJU09OOiAKIAoKICAgIENPTU1FTlRTOiAKCiAgICBIRUFSVCBNRURTOgoKICAgIElOVEVSUFJFVEVEIEJZOiBHVVBUQSxTQVRZRU5EUkE=',
              title: 'MRI Right Ankle',
            },
          },
        ],
        context: {
          related: [
            {
              reference: 'Location/ex-MHV-location-989',
            },
          ],
        },
      },
      search: { mode: 'match' },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '625881',
        meta: {
          versionId: '1',
          lastUpdated: '2024-05-21T15:39:30.126-04:00',
          source: '#byyVtiRCKRE6yvwG',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chReport',
          ],
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chSpecimen',
              ],
            },
            status: 'available',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0487',
                  code: 'SER',
                  display: 'Serum',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/61',
                  version: '5.2',
                  code: '72',
                  display: 'SERUM',
                },
              ],
              text:
                'Site or sample tested Nasopharyngeal structure (body structure)',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Gregory House, M.D.',
                family: 'House',
                given: ['Gregory'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'SARS-CoV-2 RNA QI NAA+probe~PCR',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12380',
            status: 'Final',
            code: {
              text: 'COVID-19 CEPHEID',
            },
            valueQuantity: {
              value: 'POSITIVE',
              unit: '',
            },
            interpretation: [
              {
                text: 'HH',
              },
            ],
            note: [
              {
                text: 'Result is critical high when compared to ref. range.',
              },
            ],
            performer: [
              {
                reference: '#OrgPerformer-989',
              },
            ],
            referenceRange: [
              {
                text: 'NEGATIVE',
              },
            ],
          },
        ],
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/Notes',
            valueString:
              'This assay is approved for the detection of nucleic acid from SARS-Cov-2 under a FDA Emergency Use Authorization and its performance is limited to qualified high and moderately complex laboratories designated by CLIA. Negative results do not preclude SARS-Cov-2 infection and should not be used as the sole basis for treatment or other patient management decisions. Negative results must be combined with clinical observations, patient history, and epidemiological information.  Negative SARS-CoV-2 Interpretation: The 2019 novel coronavirus (SARS-CoV-2) nucleic acids are not detected. Positive SARS-CoV-2 Interpretation: The 2019 novel coronavirus (SARS-CoV-2) target nucleic acids are detected. NOTE: These results must be accompanied with the following  Fact Sheets for: Healthcare Providers: https://www.fda.gov/media/136313/download Patients: https://www.fda.gov/media/136312/download',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2024-05-16T13:46:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12380',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '6258121',
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            type: {
              text: 'Blood',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Spencer Reid',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Complete blood count',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12390',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'WBC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 6.7,
              unit: 'bil/L',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.2 - 10.6',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12391',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'RBC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 4.98,
              unit: 'tril/L',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.5 - 5.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12392',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'HGB',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 15.0,
              unit: 'g/dL',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '13.6 - 17.0',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12393',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'HCT',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 41.6,
              unit: '%',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '41 - 51',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12394',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'MCV',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 84,
              unit: 'fL',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '82 - 100',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12395',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'ACK',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 15.0,
              unit: 'K/ccm',
            },
            interpretation: [
              {
                text: 'H',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '4.5 - 10.5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12396',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'MCHC',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 31,
              unit: 'g/dL',
            },
            interpretation: [
              {
                text: 'L',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '32 - 36',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12397',
            basedOn: [
              {
                reference: '#ex-MHV-chOrder-1a',
              },
            ],
            status: 'Final',
            code: {
              text: 'RDW',
            },
            effectiveDateTime: '1994-01-20T16:38:59-05:00',
            valueQuantity: {
              value: 14,
              unit: '%',
            },
            note: [
              {
                text: '',
              },
            ],
            specimen: {
              reference: '#ex-MHV-chSpecimen-1',
            },
            referenceRange: [
              {
                text: '12 - 14.2',
              },
            ],
          },
        ],
        extension: [
          {
            valueString: "Pat Wilsons' blood panel is standard",
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2024-05-01T08:45:00-0500',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12390',
          },
          {
            reference: '#12391',
          },
          {
            reference: '#12392',
          },
          {
            reference: '#12393',
          },
          {
            reference: '#12394',
          },
          {
            reference: '#12395',
          },
          {
            reference: '#12396',
          },
          {
            reference: '#12397',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/12321',
      resource: {
        physician: 'Gregory House, M.D.',
        resourceType: 'DiagnosticReport',
        id: '1234562786',
        meta: {
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.SPlabReport',
          ],
        },
        text: {
          status: 'generated',
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><h2><span title="Codes:{http://loinc.org 11526-1}">LR SURGICAL PATHOLOGY REPORT</span> (<span title="Codes:{http://terminology.hl7.org/CodeSystem/v2-0074 LAB}">Laboratory</span>, <span title="Codes:{http://terminology.hl7.org/CodeSystem/v2-0074 SP}">Surgical Pathology</span>) </h2><table class="grid"><tr><td>Subject</td><td><b>MTPZEROTWO DAYTSHR </b> male, DoB: 1000-01-01 ( <code>urn:oid:2.16.840.1.113883.4.349</code>/1 (use: usual))</td></tr><tr><td>When For</td><td>1999-08-11 16:09:00+0000</td></tr><tr><td>Reported</td><td>1999-08-11 16:09:00+0000</td></tr><tr><td>Identifier:</td><td> <code>urn:oid:2.16.840.1.113883.4.349.4.989</code>/LabReportTO.SP;7009190 (use: usual)</td></tr></table><p><b>Report Details</b></p></div>',
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'ex-MHV-specimen-6',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.LabSpecimen',
              ],
            },
            type: {
              text: 'Left pointer finger',
            },
            accessionIdentifier: {
              use: 'usual',
              system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
              value: 'SP 99 1804',
            },
            status: 'available',
            collection: {
              collectedDateTime: '2024-04-13T12:54:00-0500',
              bodySite: {
                text: 'Left pointer finger',
              },
            },
          },
          {
            resourceType: 'Organization',
            id: 'ex-MHV-organization-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: 'LabSiteTO.989',
              },
              {
                system: 'http://hl7.org/fhir/sid/us-npi',
                value: '1234',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
            value: 'LabReportTO.SP;7009190',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'SP',
              },
            ],
            text: 'Chemistry and hematology',
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11526-1',
            },
          ],
          text: 'Surgical Pathology',
        },
        subject: {
          reference: 'Patient/ex-MHV-patient-1',
        },
        effectiveDateTime: '2024-04-13T12:54:00-0500',
        issued: '1999-08-11T16:09:00Z',
        performer: [
          {
            reference: '#ex-MHV-organization-989',
          },
        ],
        specimen: [
          {
            reference: '#ex-MHV-specimen-6',
          },
        ],
        presentedForm: [
          {
            contentType: 'text/plain',
            data:
              'RGF0ZSBTcGVjIHRha2VuOiBBcHIgMTMsIDIwMjQgMTI6NTQgUGF0aG9sb2dpc3Q6IENIRVJZTCBKQU1FUwpEYXRlIFNwZWMgcmVjJ2Q6IEFwciAxMywgMjAyNCAxMjo1NSBUZWNoOiBDSEVSWUwgSkFNRVMKRGF0ZSBjb21wbGV0ZWQ6IEFwciAxMywgMjAyNCBBY2Nlc3Npb24gIzogQ1kgMTQgOTk5OTk4ClN1Ym1pdHRlZCBieTogR1JFR09SWSBIT1VTRSwgTS5ELiBQcmFjdGl0aW9uZXI6IFNBTkRSQSBERU5UT04KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQpTcGVjaW1lbjoKRkxVSUQKREVTQ1JJUFRJT046ClRoaXMgaXMgdGhlIE5hdGlvbmFsIHBhY2thZ2UgLSB0ZXN0aW5nIGZvciBNSFYuCk1JQ1JPU0NPUElDIEVYQU0gKERhdGUgU3BlYyB0YWtlbjogQXByIDEzLCAyMDI0IDEyOjU0KQpOb3JtYWwgZmx1aWQgLSBURVNUIE9OTFkKPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tPS0tClBlcmZvcm1pbmcgTGFib3JhdG9yeToKQ3l0b2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeToKV0FTSElOR1RJT04gREMgVkFNQw==',
          },
        ],
      },
      search: { mode: 'match' },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '6258112',
        meta: {
          versionId: '1',
          lastUpdated: '2024-05-21T15:39:30.126-04:00',
          source: '#byyVtiRCKRE6yvwG',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chReport',
          ],
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chSpecimen',
              ],
            },
            status: 'available',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0487',
                  code: 'SER',
                  display: 'Serum',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/61',
                  version: '5.2',
                  code: '72',
                  display: 'SERUM',
                },
              ],
              text: 'Urine',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Gregory House, M.D.',
                family: 'House, M.D.',
                given: ['Gregory'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Urinalysis (UA)',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12410',
            status: 'Final',
            code: {
              text: 'URINE KETONES',
            },
            valueQuantity: {
              value: 'NEG',
              unit: 'MG/DL',
            },
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12411',
            status: 'Final',
            code: {
              text: 'APPEARANCE',
            },
            valueQuantity: {
              value: 'CLEAR',
              unit: '',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: '',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12412',
            status: 'Final',
            code: {
              text: 'COLOR',
            },
            valueQuantity: {
              value: 'YELLOW',
              unit: '',
            },
            referenceRange: [
              {
                text: '',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12413',
            status: 'Final',
            code: {
              text: 'SPECIFIC GRAVITY',
            },
            valueQuantity: {
              value: 1.02,
              unit: '',
            },
            referenceRange: [
              {
                text: '1.003 - 1.035',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12414',
            status: 'Final',
            code: {
              text: 'UROBILINOGEN',
            },
            valueQuantity: {
              value: 0.2,
              unit: 'MG/DL',
            },
            referenceRange: [
              {
                text: '0.1 - 1.9',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12415',
            status: 'Final',
            code: {
              text: 'URINE BLOOD',
            },
            valueQuantity: {
              value: 'NEG',
              unit: '',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12416',
            status: 'Final',
            code: {
              text: 'URINE BILIRUBIN',
            },
            valueQuantity: {
              value: 'NEG',
              unit: '',
            },
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12417',
            status: 'Final',
            code: {
              text: 'URINE GLUCOSE',
            },
            valueQuantity: {
              value: 'NEG',
              unit: 'MG/DL',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12418',
            status: 'Final',
            code: {
              text: 'URINE PROTEIN',
            },
            valueQuantity: {
              value: 'Trace',
              unit: 'MG/DL',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12419',
            status: 'Final',
            code: {
              text: 'URINE pH',
            },
            valueQuantity: {
              value: '6.0',
              unit: '',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: '4.6 - 8.0',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12420',
            status: 'Final',
            code: {
              text: 'URINE WBC',
            },
            valueQuantity: {
              value: '>180',
              unit: 'WBC/HPF',
            },
            interpretation: [
              {
                text: 'H',
              },
            ],
            note: [
              {
                text: 'Result is high when compared to ref. range.',
              },
            ],
            referenceRange: [
              {
                text: '<5',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12421',
            status: 'Final',
            code: {
              text: 'URINE RBC',
            },
            valueQuantity: {
              value: '6',
              unit: 'RBC/HPF',
            },
            interpretation: [
              {
                text: 'H',
              },
            ],
            note: [
              {
                text: 'Result is high when compared to ref. range.',
              },
            ],
            referenceRange: [
              {
                text: '<3',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12422',
            status: 'Final',
            code: {
              text: 'URINE NITRITE',
            },
            valueQuantity: {
              value: 'POSITIVE',
              unit: '',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12423',
            status: 'Final',
            code: {
              text: 'LEUKOESTERASE',
            },
            valueQuantity: {
              value: 'LARGE',
              unit: '',
            },
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
            referenceRange: [
              {
                text: 'NEG',
              },
            ],
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2020-04-21T12:37:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12410',
          },
          {
            reference: '#12411',
          },
          {
            reference: '#12412',
          },
          {
            reference: '#12413',
          },
          {
            reference: '#12414',
          },
          {
            reference: '#12415',
          },
          {
            reference: '#12416',
          },
          {
            reference: '#12417',
          },
          {
            reference: '#12418',
          },
          {
            reference: '#12419',
          },
          {
            reference: '#12420',
          },
          {
            reference: '#12421',
          },
          {
            reference: '#12422',
          },
          {
            reference: '#12423',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '6258221',
        meta: {
          versionId: '1',
          lastUpdated: '2024-05-21T15:39:30.126-04:00',
          source: '#byyVtiRCKRE6yvwG',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chReport',
          ],
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chSpecimen',
              ],
            },
            status: 'available',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0487',
                  code: 'SER',
                  display: 'Serum',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/61',
                  version: '5.2',
                  code: '72',
                  display: 'SERUM',
                },
              ],
              text: 'Whole blood',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Gregory House, M.D.',
                family: 'House, M.D.',
                given: ['Gregory'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Hemoglobin A1C (HbA1C)',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12430',
            code: {
              text: 'HEMOGLOBIN A1C',
            },
            valueQuantity: {
              value: '14',
              unit: '%',
            },
            referenceRange: [
              {
                text: '3.4 - 6.1',
              },
            ],
            status: 'Final',
            interpretation: [
              {
                text: 'H',
              },
            ],
            note: [
              {
                text: 'Result is high when compared to ref. range.',
              },
            ],
          },
        ],
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/Notes',
            valueString:
              '*** If Diabetic, recommended HgA1C should be <7% *** Hemoglobin A1c values reported after 1-1-95 are standardized in accordance with recommendations of the Diabetes Control and Complications Trial(DCCT). Based on these recommendations, a upward shift in reported results will be noted. A table depicting this shift is available in Chemistry on request.',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2020-04-01T09:31:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12430',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DiagnosticReport/6258',
      resource: {
        resourceType: 'DiagnosticReport',
        id: '625833',
        meta: {
          versionId: '1',
          lastUpdated: '2024-05-21T15:39:30.126-04:00',
          source: '#byyVtiRCKRE6yvwG',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chReport',
          ],
        },
        contained: [
          {
            resourceType: 'Specimen',
            id: 'Specimen-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chSpecimen',
              ],
            },
            status: 'available',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0487',
                  code: 'SER',
                  display: 'Serum',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/61',
                  version: '5.2',
                  code: '72',
                  display: 'SERUM',
                },
              ],
              text: 'Plasma',
            },
            request: [
              {
                reference: '#ServiceRequest-1',
              },
            ],
            collection: {
              collectedDateTime: '2024-12-12T09:00:00-05:00',
            },
          },
          {
            resourceType: 'Practitioner',
            id: 'Provider-1',
            identifier: [
              {
                system: 'http://va.gov/terminology/vistaDefinedTerms/4',
                value: '35457-VA552',
              },
            ],
            name: [
              {
                text: 'Gregory House, M.D.',
                family: 'House, M.D.',
                given: ['Gregory'],
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'Organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'FI',
                },
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '552',
              },
            ],
            active: true,
            name: 'DAYTON, OH VAMC',
            address: [
              {
                line: ['4100 W. THIRD STREET'],
                city: 'DAYTON',
                state: 'OH',
                postalCode: '45428',
                country: 'USA',
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: 'OrgPerformer-989',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349',
                value: '989',
              },
            ],
            active: true,
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'ServiceRequest',
            id: 'ServiceRequest-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.chOrder',
              ],
            },
            status: 'unknown',
            intent: 'order',
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory procedure',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/64',
                  code: '89042.0000',
                },
                {
                  system: 'http://va.gov/terminology/vistaDefinedTerms/60',
                  code: '5150',
                  display: 'T-TRANSGLUTAMINASE IGA',
                },
              ],
              text: 'Lipid Panel',
            },
            subject: {
              reference: 'Patient/4130',
            },
            requester: {
              reference: '#Provider-1',
            },
            performer: [
              {
                reference: '#Organization-552',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12440',
            code: {
              text: 'CHOLESTEROL',
            },
            valueQuantity: {
              value: '238',
              unit: 'mg/dL',
            },
            referenceRange: [
              {
                text: '1 - 240',
              },
            ],
            status: 'Final',
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text:
                  'DESIRABLE VALUE: <200 BORDERLINE VALUE: 201-239 ELEVATED VALUE: >240',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12441',
            code: {
              text: 'TRYGLYCERIDES',
            },
            valueQuantity: {
              value: '45',
              unit: 'mg/dL',
            },
            referenceRange: [
              {
                text: '35 - 160',
              },
            ],
            status: 'Final',
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text:
                  'DESIRABLE VALUE: <150 BORDERLINE VALUE: 150-199 ELEVATED VALUE: 200-499 Patient should be fasting at time of specimen collection for valid interpretation of triglyceride level.',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12442',
            code: {
              text: 'HDL CHOLESTEROL',
            },
            valueQuantity: {
              value: '65',
              unit: 'mg/dL',
            },
            referenceRange: [
              {
                text: '32 - 78',
              },
            ],
            status: 'Final',
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
          },
          {
            resourceType: 'Observation',
            id: '12443',
            code: {
              text: 'LDL-CHOL CALC',
            },
            valueQuantity: {
              value: '120',
              unit: 'MG/DL',
            },
            referenceRange: [
              {
                text: '43 - 161',
              },
            ],
            status: 'Final',
            interpretation: [
              {
                text: '',
              },
            ],
            note: [
              {
                text: '',
              },
            ],
          },
        ],
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/Notes',
            valueString: '',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:fdc:TEST.DAYTON.MED.VA.GOV:LR',
            value: '3741350004',
          },
        ],
        basedOn: [
          {
            reference: '#ServiceRequest-1',
          },
        ],
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'CH',
              },
            ],
          },
          {
            coding: [
              {
                system: 'http://loinc.org',
                version: '2.76',
                code: '10362-2',
              },
            ],
            text: 'ENDOMYSIUM AB.IGA:PRTHR:PT:SER:ORD:',
          },
        ],
        code: {
          text: 'CH',
        },
        subject: {
          reference: 'Patient/4130',
        },
        effectiveDateTime: '2020-02-26T09:54:00-05:00',
        issued: '2024-12-12T09:00:00-05:00',
        performer: [
          {
            reference: '#OrgPerformer-989',
          },
        ],
        specimen: [
          {
            reference: '#Specimen-0',
          },
        ],
        result: [
          {
            reference: '#12440',
          },
          {
            reference: '#12441',
          },
          {
            reference: '#12442',
          },
          {
            reference: '#12443',
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
    return +item.resource.id === +id;
  });
  return res.json(response.resource);
};

module.exports = {
  all,
  single,
};
