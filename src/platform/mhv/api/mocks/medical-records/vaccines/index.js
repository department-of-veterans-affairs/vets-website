const vaccines = {
  id: '868a0f70-f920-4483-9be4-fa64f65d2e85',
  meta: {
    lastUpdated: '2023-07-21T12:22:25.721-04:00',
  },
  type: 'searchset',
  total: 5,
  link: [
    {
      relation: 'self',
      url:
        'https://mhv-intb-api.myhealth.va.gov/fhir/Immunization?_count=100&patient=952',
    },
  ],
  entry: [
    {
      fullUrl: 'https://mhv-intb-api.myhealth.va.gov/fhir/Immunization/957',
      resource: {
        resourceType: 'Immunization',
        id: 'ex-MHV-immunization-2',
        meta: {
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.immunization',
          ],
        },
        text: {
          status: 'generated',
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Generated Narrative: Immunization</b><a name="ex-MHV-immunization-2"> </a></p><div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px">Resource Immunization &quot;ex-MHV-immunization-2&quot; </p><p style="margin-bottom: 0px">Profile: <a href="StructureDefinition-VA.MHV.PHR.immunization.html">VA MHV PHR Immunization</a></p></div><p><b>identifier</b>: id:\u00a0ImmunizationTO.124685\u00a0(use:\u00a0USUAL)</p><p><b>status</b>: completed</p><p><b>vaccineCode</b>: INFLUENZA, INJECTABLE, QUADRIVALENT <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="http://terminology.hl7.org/5.0.0/CodeSystem-CPT.html">Current Procedural Terminology (CPT®)</a>#90688 &quot;IIV4 VACCINE SPLT 0.5 ML IM&quot;)</span></p><p><b>patient</b>: <a href="Patient-ex-MHV-patient-1.html">Patient/ex-MHV-patient-1</a> &quot; DAYTSHR&quot;</p><p><b>occurrence</b>: 2022-08-05 16:56:38+0000</p><p><b>recorded</b>: 2022-08-05 16:56:38+0000</p><p><b>primarySource</b>: Absent because : <code>unknown</code></p><p><b>location</b>: <a name="in-location-2"> </a></p><blockquote><p/><p><a name="in-location-2"> </a></p><p><b>identifier</b>: id:\u00a0?ngen-9?\u00a0(use:\u00a0USUAL)</p><p><b>name</b>: ADTP BURNETT</p></blockquote><h3>Performers</h3><table class="grid"><tr><td style="display: none">-</td><td><b>Actor</b></td></tr><tr><td style="display: none">*</td><td><a name="ex-MHV-organization-552"> </a><blockquote><p/><p><a name="ex-MHV-organization-552"> </a></p><p><b>identifier</b>: L:\u00a0552\u00a0(use:\u00a0USUAL)</p><p><b>active</b>: true</p><p><b>name</b>: DAYTON, OH VAMC</p><p><b>address</b>: 4100 W. THIRD STREET DAYTON OH 45428 USA </p></blockquote></td></tr></table><p><b>note</b>: test comment</p><h3>Reactions</h3><table class="grid"><tr><td style="display: none">-</td><td><b>Detail</b></td></tr><tr><td style="display: none">*</td><td><a name="in-reaction-2"> </a><blockquote><p/><p><a name="in-reaction-2"> </a></p><p><b>status</b>: final</p><p><b>code</b>: FEVER <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> ()</span></p><p><b>subject</b>: <a href="Patient-ex-MHV-patient-1.html">Patient/ex-MHV-patient-1</a> &quot; DAYTSHR&quot;</p><p><b>effective</b>: 2022-08-05 16:56:38+0000</p><p><b>value</b>: 410515003 <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="https://browser.ihtsdotools.org/">SNOMED CT</a>#410515003)</span></p></blockquote></td></tr></table><h3>ProtocolApplieds</h3><table class="grid"><tr><td style="display: none">-</td><td><b>Series</b></td><td><b>DoseNumber[x]</b></td></tr><tr><td style="display: none">*</td><td>COMPLETE</td><td>C</td></tr></table><hr/><blockquote><p><b>Generated Narrative: Location #in-location-2</b><a name="in-location-2"> </a></p><p><b>identifier</b>: id:\u00a0?ngen-9?\u00a0(use:\u00a0USUAL)</p><p><b>name</b>: ADTP BURNETT</p></blockquote><hr/><blockquote><p><b>Generated Narrative: Observation #in-reaction-2</b><a name="in-reaction-2"> </a></p><p><b>status</b>: final</p><p><b>code</b>: FEVER <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> ()</span></p><p><b>subject</b>: <a href="Patient-ex-MHV-patient-1.html">Patient/ex-MHV-patient-1</a> &quot; DAYTSHR&quot;</p><p><b>effective</b>: 2022-08-05 16:56:38+0000</p><p><b>value</b>: 410515003 <span style="background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki"> (<a href="https://browser.ihtsdotools.org/">SNOMED CT</a>#410515003)</span></p></blockquote><hr/><blockquote><p><b>Generated Narrative: Organization #ex-MHV-organization-552</b><a name="ex-MHV-organization-552"> </a></p><p><b>identifier</b>: L:\u00a0552\u00a0(use:\u00a0USUAL)</p><p><b>active</b>: true</p><p><b>name</b>: DAYTON, OH VAMC</p><p><b>address</b>: 4100 W. THIRD STREET DAYTON OH 45428 USA </p></blockquote></div>',
        },
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            identifier: [
              {
                use: 'usual',
              },
            ],
            name: 'ADTP BURNETT',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.immunizationReaction',
              ],
            },
            status: 'final',
            code: {
              text: 'FEVER',
            },
            subject: {
              reference: 'Patient/ex-MHV-patient-1',
            },
            effectiveDateTime: '2022-08-05T16:56:38Z',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '410515003',
                },
              ],
            },
          },
          {
            resourceType: 'Organization',
            id: 'ex-MHV-organization-552',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.organization',
              ],
            },
            identifier: [
              {
                use: 'usual',
                type: {
                  text: 'L',
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
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.989',
            value: 'ImmunizationTO.124685',
          },
        ],
        status: 'completed',
        vaccineCode: {
          coding: [
            {
              system: 'http://www.ama-assn.org/go/cpt',
              code: '90688',
              display: 'IIV4 VACCINE SPLT 0.5 ML IM',
            },
          ],
          text: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
        },
        patient: {
          reference: 'Patient/ex-MHV-patient-1',
        },
        occurrenceDateTime: '2022-08-05T16:56:38Z',
        recorded: '2022-08-05T16:56:38Z',
        _primarySource: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason',
              valueCode: 'unknown',
            },
          ],
        },
        location: {
          reference: '#in-location-2',
        },
        performer: [
          {
            actor: {
              reference: '#ex-MHV-organization-552',
            },
          },
        ],
        note: [
          {
            text: 'test comment',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
        protocolApplied: [
          {
            series: 'COMPLETE',
            doseNumberString: 'C',
          },
        ],
      },

      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-intb-api.myhealth.va.gov/fhir/Immunization/957',
      resource: {
        id: '957',
        meta: {
          versionId: '1',
          lastUpdated: '2023-06-02T19:37:18.810-04:00',
          source: '#d1cbc83754740901',
        },
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.349',
            value: '984.124685',
          },
        ],
        status: 'completed',
        vaccineCode: {
          coding: [
            {
              code: '90688',
              display: 'IIV4 VACCINE SPLT 0.5 ML IM',
            },
          ],
          text: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
        },
        patient: {
          reference: 'Patient/952',
        },
        occurrenceDateTime: '2023-03-05T16:56:38-04:00',
        location: {
          reference: 'Location/953',
        },
        note: [
          {
            text: 'test comment',
          },
        ],
        reaction: [
          {
            detail: {
              display: 'FEVER',
            },
          },
        ],
        resourceType: 'Immunization',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-intb-api.myhealth.va.gov/fhir/Immunization/957',
      resource: {
        id: '957',
        meta: {
          versionId: '1',
          lastUpdated: '2023-06-02T19:37:18.810-04:00',
          source: '#d1cbc83754740901',
        },
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.349',
            value: '984.124685',
          },
        ],
        status: 'completed',
        vaccineCode: {
          coding: [
            {
              code: '90688',
              display: 'IIV4 VACCINE SPLT 0.5 ML IM',
            },
          ],
          text: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
        },
        patient: {
          reference: 'Patient/952',
        },
        occurrenceDateTime: '2023-01-03T16:56:38-04:00',
        location: {
          reference: 'Location/953',
        },
        note: [
          {
            text: 'test comment',
          },
        ],
        reaction: [
          {
            detail: {
              display: 'FEVER',
            },
          },
        ],
        resourceType: 'Immunization',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-intb-api.myhealth.va.gov/fhir/Immunization/957',
      resource: {
        id: '957',
        meta: {
          versionId: '1',
          lastUpdated: '2023-06-02T19:37:18.810-04:00',
          source: '#d1cbc83754740901',
        },
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.349',
            value: '984.124685',
          },
        ],
        status: 'completed',
        vaccineCode: {
          coding: [
            {
              code: '90688',
              display: 'IIV4 VACCINE SPLT 0.5 ML IM',
            },
          ],
          text: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
        },
        patient: {
          reference: 'Patient/952',
        },
        occurrenceDateTime: '2022-08-05T16:56:38-04:00',
        location: {
          reference: 'Location/953',
        },
        note: [
          {
            text: 'test comment',
          },
        ],
        reaction: [
          {
            detail: {
              display: 'FEVER',
            },
          },
        ],
        resourceType: 'Immunization',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://mhv-intb-api.myhealth.va.gov/fhir/Immunization/956',
      resource: {
        id: '956',
        meta: {
          versionId: '1',
          lastUpdated: '2023-06-02T19:37:18.810-04:00',
          source: '#d1cbc83754740901',
        },
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.349',
            value: '984.124684',
          },
        ],
        status: 'completed',
        vaccineCode: {
          text:
            'COVID-19 (MODERNA), MRNA, LNP-S, PF, 100 MCG/0.5ML DOSE OR 50 MCG/0.25ML DOSE',
        },
        patient: {
          reference: 'Patient/952',
        },
        occurrenceDateTime: '2022-08-08T11:15:28-04:00',
        location: {
          reference: 'Location/953',
        },
        note: [
          {
            text: 'test',
          },
        ],
        resourceType: 'Immunization',
      },
      search: {
        mode: 'match',
      },
    },
  ],
  resourceType: 'Bundle',
};

module.exports = {
  vaccines,
};
