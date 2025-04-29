const all = {
  id: '5177513c-0db5-4c07-8b5f-05f57e00c044',
  meta: {
    lastUpdated: '2024-07-01T16:06:49.182-04:00',
  },
  type: 'searchset',
  total: 4,
  link: [
    {
      relation: 'self',
      url:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference?_count=9999&patient=974&status%3Anot=entered-in-error&type=11506-3%2C18842-5%2C11488-4',
    },
  ],
  entry: [
    // consult_note
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12341',
        meta: {
          versionId: '1',
          lastUpdated: '2018-04-08T15:44:39.979-05:00',
          source: '#cnKnSgzXerFBGywG',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.552',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Beth M. Smith',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Gregory House, M.D.',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5303203',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11488-4',
              display: 'Consultation Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/4103',
        },
        date: '2018-04-08T09:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2018-04-08T09:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IENPTlNVTFQgR0kgKEUpClNUQU5EQVJEIFRJVExFOiBHQVNUUk9FTlRFUk9MT0dZIENPTlNVTFQKREFURSBPRiBOT1RFOiBBUFIgOCwgMjAxOEAxMDo0MCBFTlRSWSBEQVRFOiBBUFIgOCwgMjAxOEAxMDo0MDowNwpBVVRIT1I6IEJFVEggTS4gU01JVEggRVhQIENPU0lHTkVSOiBHUkVHT1JZIEhPVVNFLCBNLkQuClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVECioqKiBDT05TVUxUIEdJIChFKSBIYXMgQURERU5EQSAqKioKUHJvY2VkdXJlIHBlcmZvcm1lZC4gU2VlIGZ1bGwgbm90ZSBpbiBwcm9jZWR1cmUgc2VjdGlvbiBvZiByZXBvcnRzIHRhYiBvciBpbiB2aXN0YSBpbWFnaW5nLgovZXMvIEJFVEggTS4gU01JVEgKQVRURU5ESU5HIFBIWVNJQ0lBTgpTaWduZWQ6IDA0LzA4LzIwMTggMTA6NDAKMDQvMDgvMjAxOCBBRERFTkRVTSBTVEFUVVM6IENPTVBMRVRFRApDb2xvbm9zY29weSBHQVAgUmVtaW5kZXI6ClJlY29tbWVuZGF0aW9ucyBhcmUgbmVlZGVkIGluIHRoZSBjbGluaWNhbCByZW1pbmRlciBzeXN0ZW0gZm9sbG93aW5nIHRoZSBwYXRpZW50J3MgbW9zdCByZWNlbnQgY29sb3JlY3RhbCBjYW5jZXIgc2NyZWVuaW5nL3N1cnZlaWxsYW5jZSB0ZXN0CihDb2xvbm9zY29weSwgU2lnbW9pZG9zY29weSBvciBDVCBDb2xvbm9ncmFwaHkpCkNvbG9ub3Njb3B5IHJlbWluZGVyIHNldCA3IHllYXJzIGZyb20gTUFSIDAyLCAyMDE4LgovZXMvIEJFVEggTS4gU01JVEg=',
              title: 'GI CONSULT NOTE',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    // physician_procedure_notes
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12342',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'John J. Lydon',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'John Simon Ritchie',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2024-11-01T08:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-11-01T08:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEFORVNUSEVTSU9MT0dZIE5PVEUgKEUpDQpTVEFOREFSRCBUSVRMRTogQU5FU1RIRVNJT0xPR1kgTk9URQ0KREFURSBPRiBOT1RFOiBGRUIgMjgsIDIwMjRAMTA6MzcgRU5UUlkgREFURTogRkVCIDI4LCAyMDI0QDEwOjM3OjQ2DQpBVVRIT1I6IEpPSE4gSi4gTFlET04gRVhQIENPU0lHTkVSOiBKT0hOIFNJTU9OIFJJVENISUUNClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEDQpbWH0gTUFDIFsgXSBHZW5lcmFsIGFuZXN0aGVzaWEgd2FzIGFkbWluaXN0ZXJlZCBmb3IgQ29sb25vc2NvcHkNCi9lcy8gSk9ITiBKLiBMWURPTg0KQU5FU1RIRVNJT0xPR0lTVA0KU2lnbmVkOiAwMi8yOC8yMDI0IDEwOjM4',
              title: 'ANESTHESIOLOGY NOTE (E)',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12343',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'John J. Lydon',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'John Simon Ritchie',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2022-08-01T07:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-02-28T07:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEFORVNUSEVTSUEgUFJFSU5EVUNUSU9OIE5PVEUNClNUQU5EQVJEIFRJVExFOiBBTkVTVEhFU0lPTE9HWSBOT1RFDQpEQVRFIE9GIE5PVEU6IEZFQiAyOCwgMjAyNEAxMDozNiBFTlRSWSBEQVRFOiBGRUIgMjgsIDIwMjRAMTA6MzY6MjgNCkFVVEhPUjogSk9ITiBKLiBMWURPTiBFWFAgQ09TSUdORVI6IEpPSE4gU0lNT04gUklUQ0hJRQ0KVVJHRU5DWTogU1RBVFVTOiBDT01QTEVURUQNCkFORVNUSEVTSUEgUFJFSU5EVUNUSU9OIE5PVEUgV0lUSCBQUklPUiBBTkVTVEhFU0lBIFBSRU9QIEFTU0VTU01FTlQNClBhdGllbnQgaWRlbnRpZmllZCBieSBuYW1lIGFuZCBlaXRoZXIgZGF0ZSBvZiBiaXJ0aCBvciBmdWxsIHNvY2lhbCBzZWN1cml0eS4NCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NClNjaGVkdWxlZCBwcm9jZWR1cmU6IENvbG9uDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpEaWFnbm9zaXM6U2NyZWVuaW5nDQpQUkVPUEVSQVRJVkUgQVNTRVNTTUVOVC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpBU0Egc3RhdHVzOiBJSUkNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCkFsbGVyZ3k6UGF0aWVudCBoYXMgYW5zd2VyZWQgTktBDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpQYXRpZW50J3MgcHJlb3BlcmF0aXZlIGFzc2Vzc21lbnQgcmV2aWV3ZWQtLS0tLS0tDQpUaGVyZSBhcmUgbm8gc2lnbmlmaWNhbnQgY2hhbmdlcywgbmV3IGNvbmRpdGlvbnMsIG9yIGFkZGl0aW9ucyBmcm9tIHRoZSBwYXRpZW50J3MgYW5lc3RoZXNpYSBwcmVvcGVyYXRpdmUgYXNzZXNzbWVudA0KTlBPIHN0YXR1cy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCk1ldCBBU0EgZ3VpZGVsaW5lcyAoPjIgaHJzIGNsZWFyIGxpcXVpZHMsID42IGhycyBsaWdodCBtZWFsLCA+OCBocnMNCmhlYXZ5DQptZWFsKQ0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NClZpdGFsIHNpZ25zIHN0YWJsZQ0KSFI6IDkxICgwMi8yOC8yMDI0IDEwOjEzKQ0KQlA6IDE0Ny85MCAoMDIvMjgvMjAyNCAxMDoxMykNClJSOiAxNyAoMDIvMjgvMjAyNCAxMDoxMykNCk8yOiAxMDAlICgwMi8yOC8yMDI0IDEwOjEzKQ0KVGVtcDogOTcuMyBGIFszNi4zIENdICgwMi8yOC8yMDI0IDEwOjEzKQ0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCkFpcndheSBFeGFtOg0KTWFsbGFtcGF0aSBDbGFzczogMg0KTW91dGggb3BlbmluZzogZnVsbA0KTmVjazogZnVsbCByYW5nZSBvZiBtb3Rpb24NClRoeXJvbWVudGFsIGRpc3RhbmNlOiA+NmNtDQpEZW50aXRpb246IG5vcm1hbA0KQ2FyZGlhYyBTeXN0ZW06DQpDYXJkaW92YXNjdWxhciBleGFtIG5vcm1hbA0KUmVzcGlyYXRvcnk6DQpDbGVhciB0byBhdXNjdWx0YXRpb24sIG5vcm1hbCByZXNwaXJhdG9yeSByYXRlIGFuZCBlZmZvcnQNCk1lbnRhbC9OZXVybyBleGFtOg0KQWxlcnQsIG9yaWVudGVkLCBjYWxtLCBjb29wZXJhdGl2ZQ0KQW5lc3RoZXRpYyB0ZWNobmlxdWUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQ0KTW9uaXRvcmVkIGFuZXN0aGVzaWEgY2FyZQ0KTW9uaXRvcnMvRXF1aXBtZW50OiBTdGFuZGFyZCBtb25pdG9ycy0tLS0tLS0tLS0tDQpOb24taW52YXNpdmU6DQpJbmZvcm1lZCBjb25zZW50IGRpc2N1c3Npb24gb2YgYW5lc3RoZXNpYSBwbGFuDQpUaGUgYW5lc3RoZXRpYyBwbGFuIGhhcyBiZWVuIGRpc2N1c3NlZCB3aXRoIHRoZSBwYXRpZW50IGFuZC9vciByZXNwb25zaWJsZSByZXByZXNlbnRhdGl2ZS4gVGhlIHBhdGllbnQvcmVwcmVzZW50YXRpdmUgaGFzIGJlZW4gZW5jb3VyYWdlZCB0byBhc2sgcXVlc3Rpb25zIGFuZCBhbnkgY29uY2VybnMgaGF2ZSBiZWVuIGFkZHJlc3NlZC4gVGhlIHJpc2tzLCBiZW5lZml0cywgc2lkZSBlZmZlY3RzLCBhbmQgYWx0ZXJuYXRpdmUgb3B0aW9ucyBvZiB0aGUgcGxhbiB3ZXJlIGRpc2N1c3NlZC4gVGhlIHBhdGllbnQvcmVwcmVzZW50YXRpdmUgZW5kb3JzZXMgdW5kZXJzdGFuZGluZyBvZiB0aGUgaW5mb3JtYXRpb24gZGlzY2xvc2VkLg0KVGhlIHBhdGllbnQvcmVwcmVzZW50YXRpdmUgdm9sdW50YXJpbHkgZWxlY3RzIHRvIG1vdmUgZm9yd2FyZCB3aXRoIHRoZSBhbmVzdGhldGljIHBsYW4uDQpQbGFubmVkIGRlc3RpbmF0aW9uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpQaGFzZSBJIFBBQ1UNCi9lcy8gSk9ITiBKLiBMWURPTg0KQU5FU1RIRVNJT0xPR0lTVA0KU2lnbmVkOiAwMi8yOC8yMDI0IDEwOjM3',
              title: 'ANESTHESIA PREINDUCTION NOTE',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12344',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Calvin Broadus',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: '',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2024-06-29T07:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-02-22T07:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEdJL0hFUEFUT0xPR1kgVEVMRVBIT05FIE5PVEUNClNUQU5EQVJEIFRJVExFOiBJTlRFUk5BTCBNRURJQ0lORSBURUxFUEhPTkUgRU5DT1VOVEVSIE5PVEUNCkRBVEUgT0YgTk9URTogRkVCIDIyLCAyMDI0QDE0OjEwIEVOVFJZIERBVEU6IEZFQiAyMiwgMjAyNEAxNDoxMDoyMQ0KQVVUSE9SOiBDQUxWSU4gQlJPQURVUyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KUHQgd2FzIGNhbGxlZCBhbmQgbGVmdCBhIG1lc3NhZ2UgdG8gY2FsbCB0aGUgR0kgb2ZmaWNlIHdpdGggcmVxdWVzdCB0byBzcGVhayB3aXRoIFByZXByb2NlZHVyZSB0ZWxlIHByb3ZpZGVyIG9mIHRoZSBkYXkuDQpUaGFua3MsDQpDQUxWSU4gQlJPQURVUw0KL2VzLyBDQUxWSU4gQlJPQURVUw0KUEhZU0lDSUFOIEFTU0lTVEFOVA0KU2lnbmVkOiAwMi8yMi8yMDI0IDE0OjEw',
              title: 'GI/HEPATOLOGY TELEPHONE NOTE',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12345',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Andre Young',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: '',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2024-05-20T12:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-01-30T12:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEhUIE5PVEUNClNUQU5EQVJEIFRJVExFOiBDQVJFIENPT1JESU5BVElPTiBIT01FIFRFTEVIRUFMVEggTk9URQ0KREFURSBPRiBOT1RFOiBKQU4gMzAsIDIwMjRAMTM6MTIgRU5UUlkgREFURTogSkFOIDMwLCAyMDI0QDEzOjEyOjEyDQpBVVRIT1I6IEFORFJFIFlPVU5HIEVYUCBDT1NJR05FUjoNClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEDQpTVUJKRUNUOiBNb250aGx5IENvbnRhY3QgTm90ZQ0KSE9NRSBURUxFSEVBTFRIIE1PTlRITFkgQ09OVEFDVA0KPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KVkVORE9SL0RFVklDRSBVVElMSVpFRDogQ29nbm9zYW50ZS9UYWJsZXQNCkRNUDogRE1QIC0gVkhBIERpYWJldGVzIDA2MzAyMyAvICg2NC8zNjQpDQpFTlJPTExNRU5UIERBVEU6IDExLzYvMjMNCkZJUlNUIFRSQU5TTUlTU0lPTiBEQVRFOiAxMS83LzIzDQpUUkFOU01JU1NJT04gUkFURToNCkhUIHByb2dyYW0gcmVxdWlyZXMgbWVldGluZyBhIHNjb3JlIGdvYWwgb2YgYXQgbGVhc3QgOTAtMTAwJSBmb3IgbW9udGhseSBkYXRhIHRyYW5zbWlzc2lvbnMgd2hpY2ggaW52b2x2ZXMgdHJhbnNtaXR0aW5nIHZpdGFsIHNpZ24gZGF0YSBtb3N0IGRheXMgb2YgdGhlIHdlZWsgdmlhIEhUIGRldmljZQ0KPlZldGVyYW4ncyBtb250aGx5IGRhdGEgdHJhbnNtaXNzaW9uIHNjb3JlczoNCkRlYy4gMjAyMz04MSUNCkphbi4gMjAyND03NyUgc28gZmFyIGZvciB0aGUgbW9udGgNCjMwLURBWSBWSVRBTCBTSUdOIFNVTU1BUlkNCkJHIGF2ZXJhZ2UgMTA4IG1nL2RsDQoqKipWZXRlcmFuIHN0YXRlcyB0aGUgcmVzdWx0cyBvZiBBMWMgZnJvbSBET0QgcHJvdmlkZXIgZG9uZSBKYW4uIDE3dGggd2FzIDguMw0KU3BlY2ltZW46IEJMT09ELiBDSCAwNzAzIDUyOQ0KU3BlY2ltZW4gQ29sbGVjdGlvbiBEYXRlOiBKdWwgMDMsIDIwMjNAMTA6NTgNClRlc3QgbmFtZSBSZXN1bHQgdW5pdHMgUmVmLiByYW5nZSBTaXRlIENvZGUNCkhnYiBBMUMgOC4yIEggJSA0LjAgLSA2LjAgWzY4OF0NCkV2YWw6IFZhbHVlcyBvYnRhaW5lZCBmcm9tIEExQyBtZWFzdXJlbWVudHMgY2FuIHZhcnkuIEZvciB0eXBpY2FsIEExQyBhc3NheXMsDQpFdmFsOiBhIHJlcG9ydGVkIHZhbHVlIG9mIDcuMCBjb3VsZCBhY3R1YWxseSBiZSBiZXR3ZWVuIDYuNzIgYW5kIDcuMjggaWYNCkV2YWw6IG1lYXN1cmVkIGJ5IGEgcmVmZXJlbmNlIG1ldGhvZC4gQSByZXBvcnRlZCB2YWx1ZSBvZiA5LjAgY291bGQgYWN0dWFsbHkgYmUNCkV2YWw6IGJldHdlZW4gOC43MyBhbmQgOS4yNy4NCkV2YWw6IFJlZjogaHR0cDovL3d3dy5uZ3NwLm9yZy9DQVBkYXRhLmFzcA0KKioqU3RhdGVzIERPRCBwcm92aWRlciBjdXJyZW50bHkgZG9pbmcgd29yayB1cCB3aXRoIGFkZGl0aW9uYWwgbGFicyB0byBhc3Nlc3MgaWYgaGUgaGFzIHR5cGUgMiBETS4gSGFzIHVwY29taW5nIERPRCBwcm92aWRlciBhcHB0LiBuZXh0IFR1ZXNkYXkNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NClNNQVJUIEdPQUwoUykgQVMgRVNUQUJMSVNIRUQgVVBPTiBFTlJPTExNRU5UOg0KRE0gR09BTDogVGhlIFZldGVyYW4gd2lsbCBkZWNyZWFzZSBoaXMgSGdiQTFjIGJ5IGF0IGxlYXN0IDEtMiUgaW4gMy02IG1vbnRocywgYnkgdGFraW5nIERNIG1lZGljYXRpb25zIGFzIHByZXNjcmliZWQsIG1ha2luZyBsaWZlc3R5bGUgY2hhbmdlcyB3aXRoIGRpZXQvZXhlcmNpc2UsIHRyYW5zbWl0dGluZyB2aXRhbCBzaWduIGRhdGEvYW5zd2VyaW5nIGRhaWx5IGVkdWNhdGlvbmFsIGhlYWx0aCBjaGVjayBxdWVzdGlvbnMgdmlhIEhUIGRldmljZS9wbGF0Zm9ybSBvdmVyIHRoZSBuZXh0IDkwIGRheXMgVmV0ZXJhbiB3aWxsIHdhbGsgYXQgbGVhc3QgMTAgbWludXRlcyBhZnRlciBlYWNoIG1lYWwgZm9yIGEgdG90YWwgb2YgMzAgbWludXRlcyBwZXIgZGF5IHRvIGhlbHAgY29udHJvbCBwb3N0LXByYW5kaWFsIGJsb29kIHN1Z2FycyB4IDMwLTYwIGRheXMNCkFTU0VTU01FTlQgT0YgVkVURVJBTiBDT05ESVRJT04vU01BUlQgR09BTCBQUk9HUkVTUzoNClZldGVyYW4gY29udGFjdGVkIGF0IHRoaXMgdGltZSBmb3IgbW9udGhseSBwcm9ncmVzcyByZXZpZXcuIFZldGVyYW4gZXhwcmVzc2VzIGNvbmNlcm5zIGFib3V0IGluY3JlYXNlIGluIGhpcyBBMWMuIFN0YXRlcyBoZSBhbmQgaGlzIHdpZmUgY29uc3VtZSB0aGUgc2FtZSBwcmVwYXJlZCBtZWFscyBhdCBob21lLCBidXQgc2hlIGhhcyBhIGJldHRlciBBMWMuIFN0YXRlcyBoZSBoYXMgaGFkIGYvdSBET0QgbnV0cml0aW9uIHJlZmVycmFsIGFuZCBoYXMgYmVlbiBwcm92aWRlZCBoYW5kb3V0cyBmb3IgY2FyYm9oeWRyYXRlIGNvdW50aW5nLiBIZSBzdGF0ZXMgaGUgd2lsbCBrZWVwIHdyaXRlciBwb3N0ZWQgcmVnYXJkaW5nIGxhYiByZXN1bHRzIHdoZW4gaGUgc2VlcyBoaXMgRE9EIHByb3ZpZGVyIG5leHQgVHVlc2RheSAoRmViLiA2dGgpDQpEaXNjdXNzZWQgdGhlIGJlbmVmaXRzIG9mIGJlaW5nIG1vcmUgYWN0aXZlIHdoaWNoIGNhbiBoZWxwIHRoZSBib2R5IHVzZSBpbnN1bGluIGJldHRlciBieSBpbmNyZWFzaW5nIGluc3VsaW4gc2Vuc2l0aXZpdHkuIEV4ZXJjaXNlIGNhbiBiZSBicm9rZW4gdXAgaW4gaW5jcmVtZW50cyBvZiAxMCBtaW4uIDN4L2RheSBvciAxNSBtaW51dGVzIDJ4L2RheQ0KKioqU3RhdGVzIGhlIHRyaWVzIHRvIHdhbGsgYXQgbGVhc3QgMzAgbWluIHBlciBkYXkgZHVyaW5nIGhpcyAzMCBtaW51dGUgbHVuY2gNCmJyZWFrDQpEaXNjdXNzZWQgdGhlIGltcG9ydGFuY2Ugb2YgZWF0aW5nIGEgY29uc2lzdGVudCBhbW91bnQgb2YgZm9vZCBhbmQgdGFraW5nIGluc3VsaW4gYXMgZGlyZWN0ZWQgd2hpY2ggY2FuIGdyZWF0bHkgaW1wcm92ZSBzdWdhciBsZXZlbHMuIFN0YXRlcyBoZSBpcyBjdXJyZW50bHkgdGFraW5nIDE2IHVuaXRzIG9mIGdsYXJnaW5lIGluc3VsaW4uDQpWZXRlcmFuIHJlcG9ydHMgMTAwJSBjb21wbGlhbmNlIHdpdGggYWxsIG1lZGljYXRpb25zLg0KTm8gZnVydGhlciBuZWVkcyBhdCB0aGlzIHRpbWUsIHZldGVyYW4gdGhhbmtlZCB3cml0ZXIgZm9yIGNhbGwuDQpTTUFSVCBHT0FMUw0KLS0tLS0tLS0tLS0NCiggKU1FVA0KKCApTk9UIE1FVA0KKFgpSU4gUFJPR1JFU1MNCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQpDQVJFIENPT1JESU5BVE9SIFBMQU46DQo+IFdpbGwgY29udGludWUgdG8gbW9uaXRvciB0cmFuc21pdHRlZCBkYXRhIGFuZCBjb250YWN0IHZldGVyYW4gYW5kL29yIHByb3ZpZGVyIGFzIG5lZWRlZA0KPiBFbmNvdXJhZ2VkIHZldGVyYW4gdG8gaW5jcmVhc2UgY3VycmVudCB0cmFuc21pc3Npb24gcmF0ZSBpbiBhY2NvcmRhbmNlIHdpdGggSFQgcHJvZ3JhbSBnb2FsIG9mIDEwMCUNCj4gV2lsbCBjb250aW51ZSB0byBzdXBwb3J0IHZldGVyYW4gaW4gaGlzIHByb2dyZXNzIHRvd2FyZCBTTUFSVCBnb2FsKHMpDQovZXMvIEFORFJFIFlPVU5HDQpNU04sIFJOIEhvbWUgVGVsZWhlYWx0aCBDYXJlIENvb3JkaW5hdG9yDQpTaWduZWQ6IDAxLzMwLzIwMjQgMTQ6Mzg=',
              title: 'HT NOTE',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12346',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Andre Young',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: '',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2024-03-05T10:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-03-05T10:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEhUIE1PTlRITFkgTU9OSVRPUiBOT1RFDQpTVEFOREFSRCBUSVRMRTogQ0FSRSBDT09SRElOQVRJT04gSE9NRSBURUxFSEVBTFRIIFNVTU1BUklaQVRJT04NCkRBVEUgT0YgTk9URTogSkFOIDMwLCAyMDI0QDA5OjM4IEVOVFJZIERBVEU6IEpBTiAzMCwgMjAyNEAwOTozOQ0KQVVUSE9SOiBBTkRSRSBZT1VORyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KVGhlIFZldGVyYW4gaXMgZW5yb2xsZWQgaW4gdGhlIEhvbWUgVGVsZWhlYWx0aCAoSFQpIHByb2dyYW0gYW5kIGNvbnRpbnVlcyB0byBiZSBtb25pdG9yZWQgdmlhIEhUIHRlY2hub2xvZ3kuIFRoZSBkYXRhIHNlbnQgYnkgdGhlIFZldGVyYW4gaXMgcmV2aWV3ZWQgYW5kIGFuYWx5emVkIGJ5IHRoZSBIVCBzdGFmZiwgd2hvIHByb3ZpZGUgb25nb2luZyBjYXNlIG1hbmFnZW1lbnQgYW5kIFZldGVyYW4gaGVhbHRoIGVkdWNhdGlvbiB3aGlsZSBjb21tdW5pY2F0aW5nIGFuZCBjb2xsYWJvcmF0aW5nIHdpdGggdGhlIGhlYWx0aCBjYXJlIHRlYW0gYXMgYXBwcm9wcmlhdGUuIFRoaXMgbm90ZSBjb3ZlcnMgYSB0b3RhbCBvZiAzMCBtaW51dGVzIGZvciB0aGUgbW9udGggbW9uaXRvcmVkLg0KTW9udGggbW9uaXRvcmVkOiBKYW4uIDIwMjQNCi9lcy8gQU5EUkUgWU9VTkcNCk1TTiwgUk4gSG9tZSBUZWxlaGVhbHRoIENhcmUgQ29vcmRpbmF0b3INClNpZ25lZDogMDEvMzAvMjAyNCAwOTo0MA==',
              title: 'HT MONTHLY MONITOR NOTE',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12347',
        meta: {
          versionId: '2',
          lastUpdated: '2024-01-08T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Dana Owens',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: '',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2024-01-08T10:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-01-08T10:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IFBSSU1BUlkgQ0FSRSBOT1RFClNUQU5EQVJEIFRJVExFOiBQUklNQVJZIENBUkUgTk9URQpEQVRFIE9GIE5PVEU6IEpBTiAwOCwgMjAyNEAwOTo0NSBFTlRSWSBEQVRFOiBKQU4gMDgsIDIwMjRAMDk6NDU6MDAKQVVUSE9SOiBCRVRIIE0uIFNNSVRIIEVYUCBDT1NJR05FUjoKVVJHRU5DWTogU1RBVFVTOiBDT01QTEVURUQKUFJJTUFSWSBDQVJFIE5PVEUKRmFjZS10by1GYWNlCldJTFNPTiwgUEFUIGlzIGEgMjEgeWVhciBvbGQgdmV0ZXJhbiB3aG8gcHJlc2VudHMgZm9yIGEKZmFjZS10by1mYWNlIGZvbGxvdy11cCB2aXNpdC4KQ0hJRUYgQ09NUExBSU5UL0hJU1RPUlkgT0YgUFJFU0VOVCBJTExORVNTOiBUZXN0aW5nIHRvIHNlZSBpZiBhZnRlciB2aXNpdApzdW1tYXJ5IHZpZXdhYmxlIGluIEpMVgpFWEFNCk5PIFZJVEFMUyBGT1VORCBTcDAyIC0tLQpHZW5lcmFsOgpDaGVzdDoKQ2FyZGlvdmFzY3VsYXI6CkFiZG9tZW46CkV4dHJlbWV0aWVzOgpPdGhlcjoKQVNTRVNTTUVOVC9QTEFOCldyaXR0ZW4gQWZ0ZXIgVmlzaXQgU3VtbWFyeSBpbnN0cnVjdGlvbnMgcmV2aWV3ZWQgd2l0aCBwYXRpZW50LiBQYXRpZW50CnByb3ZpZGVkIGNvcHkgb2YgdXBkYXRlZCBtZWRpY2F0aW9uIGxpc3QuClJFVFVSTiBUTyBDTElOSUM6IFBlciBSVEMgb3JkZXIsIG9yIHNvb25lciBQUk4KVG90YWwgdGltZSBzcGVudCBpbiBjbGluaWNhbCBjYXJlIHJlbGF0ZWQgdG8gdGhpcyB2aXNpdDogNSBtaW51dGVzCk1FRElDQVRJT04gUkVDT05DSUxJQVRJT046Ck1lZGljYXRpb24gUmVjb25jaWxpYXRpb24gd2FzIG5vdCBwZXJmb3JtZWQgYXQgdGhpcyB2aXNpdCBhcyBwYXRpZW50CmFuZC9vciBjYXJlZ2l2ZXIgaXMgbm90IGFibGUgdG8gY29uZmlybSBtZWRpY2F0aW9ucyBoZS9zaGUgaXMgdGFraW5nLiBUaGUKaW1wb3J0YW5jZSBvZiBtYW5hZ2luZyBtZWRpY2F0aW9uIGluZm9ybWF0aW9uIHdhcyBleHBsYWluZWQgdG8gdGhlCnBhdGllbnQuClBBU1QgTUVESUNBTCBISVNUT1JZCkVudGVyIFByb2JsZW1zOgpObyBhY3RpdmUgcHJvYmxlbXMgaW4gY29tcHV0ZXJpemVkIHByb2JsZW0gbGlzdCBhcyBvZiA3LzE5LzIyQDIxOjM2ClNFUlZJQ0UgQ09OTkVDVEVEIENPTkRJVElPTlMKTFVORyBDT05ESVRJT04gNjAlIFMvQwpNRURJQ0FUSU9OUwpMb2NhbDoKQWN0aXZlIE91dHBhdGllbnQgTWVkaWNhdGlvbnMgKGV4Y2x1ZGluZyBTdXBwbGllcyk6Ck5vIE1lZGljYXRpb25zIEZvdW5kClJlbW90ZTogTm8gQWN0aXZlIFJlbW90ZSBNZWRpY2F0aW9ucyBmb3IgdGhpcyBwYXRpZW50CkFMTEVSR0lFUwpMb2NhbDogQWxsZXJneSBBc3Nlc3NtZW50IE5vdCBEb25lZQpSZW1vdGU6CkZBQ0lMSVRZIEFMTEVSR1kvQURSCi0tLS0tLS0tIC0tLS0tLS0tLS0tCjM2M15BTkNIT1JBR0UgVkEgTUVESUNBTENFTlRFUl40NjMgVEVUQU5VUyBUT1hPSUQKNjQ4XlBPUlRMQU5EIFZBIE1FRElDQUwgQ0VOVEVSXjY0OCBBREhFU0lWRSBUQVBFCjY0OF5QT1JUTEFORCBWQSBNRURJQ0FMIENFTlRFUl42NDggQUxVTUlOVU0gSFlEUk9YSURFL01BR05FU0lVTSBIWURST1hJREUgV0lMU09OIFBBVCBDT05GSURFTlRJQUwgUGFnZSA0NiBvZiAyMDk0CjY0OF5QT1JUTEFORCBWQSBNRURJQ0FMIENFTlRFUl42NDggRUdHUwo2NDheUE9SVExBTkQgVkEgTUVESUNBTCBDRU5URVJeNjQ4IExJU0lOT1BSSUwKNjQ4XlBPUlRMQU5EIFZBIE1FRElDQUwgQ0VOVEVSXjY0OCBQRU5JQ0lMTElOCjY0OF5QT1JUTEFORCBWQSBNRURJQ0FMIENFTlRFUl42NDggUFJBWk9TSU4KNjQ4XlBPUlRMQU5EIFZBIE1FRElDQUwgQ0VOVEVSXjY0OCBTVUxGQSBEUlVHUwo2NDheUE9SVExBTkQgVkEgTUVESUNBTCBDRU5URVJeNjQ4IFRFVFJBQ1lDTElORQo2NjheTUFOTi1HUkFORFNUQUZGIFZBTUNeNjY4IENMSU5EQU1ZQ0lOCjY4N15KT05BVEhBTiBNLiBXQUlOV1JJR0hUIFZBTUNeNjg3IFBFTklDSUxMSU4KTEFCUzoKTm8gZGF0YSBhdmFpbGFibGUgSEVNT0dMT0JJTiBBMWMsIElOVEVHUkEgLSBOT05FIEZPVU5ECk5vIGRhdGEgYXZhaWxhYmxlIGZvcjogQ0hPTEVTVEVST0wKVFJJR0xZQ0VSSURFUwpIREwgQ0hPTEVTVEVST0wKTERMLCBDQUxDVUxBVEVECkxPTCwgRElSRUNUIE5vIENCQyBQYW5lbCBGb3VuZAovZXMvIEJFVEggTS4gU01JVEgsIEROUCwgQVJOUCwgRk5QLUJDCk51cnNlIFByYWN0aXRpb25lciAtIFdvbWVuJ3MgSGVhbHRoIENsaW5pYwpTaWduZWQ6IDAxLzA4LzIwMjQgMjE6NDI=',
              title: 'PRIMARY CARE NOTE',
              creation: '2024-01-08T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    // discharge_summary
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1102',
      resource: {
        id: '12348',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.552',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Dana Owens',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'DOE,JOHN',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5281877',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '18842-5',
              display: 'Discharge summary',
            },
          ],
          text: 'DISCHARGE SUMMARY',
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2023-11-28T09:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-01-08T09:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IERJU0NIQVJHRSBTVU1NQVJZDQpTVEFOREFSRCBUSVRMRTogRElTQ0hBUkdFIFNVTU1BUlkNCkRBVEUgT0YgTk9URTogSkFOIDA4LCAyMDI0QDEwOjEyIEVOVFJZIERBVEU6IEpBTiAwOCwgMjAyNEAxMDoxMjo1NA0KQVVUSE9SOiBEQU5BIE9XRU5TIEVYUCBDT1NJR05FUjoNClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEDQpESVNDSEFSR0UgU1VNTUFSWToNClZJVEFMIFNJR05TIE1PTklUT1JJTkcNCkRhdGUgYW5kIFRpbWU6MS84LzIwMjQgQCAwOTQ5DQpCbG9vZCBwcmVzc3VyZSA6IDEyMi84N21tIEhHDQpQdWxzZSByYXRlIDogODhwZXIgbWluDQpSZXNwaXJhdG9yeSByYXRlIDogMTdwZXIgbWluDQpUZW1wZXJhdHVyZSA6IDk3LjdGDQpPMiBTYXR1cmF0aW9uIDogMTAwcGVyY2VudA0KKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KUG9zdCBBbmVzdGhlc2lhIFNlZGF0aW9uIFNjb3JlIC0gUGhhc2UgMQ0KUGhhc2UgMSBEaXNjaGFyZ2UgQ3JpdGVyaWENClRPVEFMIFNDT1JFPTE0DQpPeHlnZW5hdGlvbg0KMiBQb2ludHMgLSBTcE8yIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byA5NCUgb3IgYmFzZWxpbmUgb24gcm9vbSBhaXINClBBQ1UgUmVzcGlyYXRvcnkgU3RhdHVzDQoyIFBvaW50cyAtIE5vcm1hbCBicmVhdGhpbmcgYW5kIGRlZXAgY291Z2ggb24gY29tbWFuZA0KQ2lyY3VsYXRvcnkgU3RhdHVzDQoyIFBvaW50cyAtIEJQL0hSIGxlc3MgdGhhbiAyMCUgb3IgMjAgbW1IZyBvZiBiYXNlbGluZQ0KTGV2ZWwgb2YgQ29uc2Npb3VzbmVzcw0KMiBQb2ludHMgLSBGdWxseSBhd2FrZSBvciBlYXNpbHkgYXdha2VuZWQNClBhaW4NCjIgUG9pbnRzIC0gTWluaW1hbCBvciBub25lIC0gUGFpbiBTY29yZSAwLTQgb3IgYXQgdG9sZXJhYmxlIGxldmVsIG9yIGF0IGJhc2VsaW5lDQpOYXVzZWEvVm9taXRpbmcNCjIgUG9pbnRzIC0gTWluaW1hbCBvciBub25lDQpMZXZlbCBvZiBBY3Rpdml0eQ0KMiBQb2ludHMgLSBBYmxlIHRvIG1vdmUgYWxsIGV4dHJlbWl0aWVzIHZvbHVudGFyaWx5IG9yIG9uIGNvbW1hbmQgb3IgbW92ZXMgYWxsIGV4dHJlbWl0aWVzIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBleHRyZW1pdHkgdHJlYXRlZCB3aXRoIHBlcmlwaGVyYWwgbmVydmUgYmxvY2sgb3IgcGF0aWVudCBiYXNlbGluZQ0KVkEtUEFTIFBoYXNlIDEgdGltZSBkb2N1bWVudGVkDQpUaW1lOiAwOTQ5DQpOdXJzaW5nIE5vdGU6UGF0aWVudCByZWFkeSBmb3IgZGlzY2hhcmdlLiBEaXNjaGFyZ2UgaW5zdHJ1Y3Rpb25zIGFuZCBwcm9jZWR1cmUgcmVwb3J0IGdpdmVuIHRvIHBhdGllbnQuIFRoZSBwYXRpZW50IHZlcmJhbGl6ZXMgdW5kZXJzdGFuZGluZyBvZiBpbnN0cnVjdGlvbnMuDQpFS0c6IE5vIGFjdXRlIEVLRyBjaGFuZ2VzDQpSRVNQSVJBVE9SWToNCk8yIGFkbWluaXN0ZXJlZDpub25lLA0KR1U6DQpVcmluZSBPdXRwdXQ6aGFzIG5vdCB2b2lkZWQNCkNvbG9yOiBVcmluZTpuL2ENCkdJOg0KTmF1c2VhIDogTm8NClZvbWl0aW5nOiBObw0KQWJkb21lbjpub24tZGlzdGVuZGVkDQpCb3dlbCBTb3VuZHM6cHJlc2VudA0KSU5UQUtFOg0KUE86IDAgbWwNCklWOiA1MDBtbA0KVE9UQUw6IDUwMG1sDQpPVVRQVVQ6DQpVcmluZTogMG1sDQpUT1RBTDogMG1sDQpQQUNVIERJU0NIQVJHRSBDUklURVJJQQ0KRGlzY2hhcmdlZCBieSBhbmVzdGhlc2lvbG9naXN0Lg0KQWxlcnQgYW5kIG9yaWVudGVkIG9yIGF0IGJhc2VsaW5lLg0KTW92ZXMgYWxsIGV4dHJlbWl0aWVzIG9yIGF0IGJhc2VsaW5lLg0KVml0YWwgc2lnbnMgYXJlIHN0YWJsZSBvciBhdCBiYXNlbGluZS4NCk5vIGV4Y2Vzc2l2ZSBibGVlZGluZy4NCkFkZXF1YXRlIHBhaW4gY29udHJvbA0KL2VzLyBEQU5BIE9XRU5TDQpSTiBTVEFGRg0KU2lnbmVkOiAwMS8wOC8yMDI0IDEwOjIz',
              title: 'DISCHARGE SUMMARY',
              creation: '2024-01-08T09:00:00-05:00',
            },
          },
        ],
        context: {
          period: {
            start: '2024-01-08T08:00:00-05:00',
            end: '2024-01-08T09:00:00-05:00',
          },
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    // physician_procedure_note
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '12349',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Andre Young',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: '',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2023-07-19T10:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2023-12-28T10:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEhUIE1PTlRITFkgTU9OSVRPUiBOT1RFDQpTVEFOREFSRCBUSVRMRTogQ0FSRSBDT09SRElOQVRJT04gSE9NRSBURUxFSEVBTFRIIFNVTU1BUklaQVRJT04NCkRBVEUgT0YgTk9URTogREVDIDI4LCAyMDIzQDA2OjU4IEVOVFJZIERBVEU6IERFQyAyOCwgMjAyM0AwNjo1ODozOA0KQVVUSE9SOiBBTkRSRSBZT1VORyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KVGhlIFZldGVyYW4gaXMgZW5yb2xsZWQgaW4gdGhlIEhvbWUgVGVsZWhlYWx0aCAoSFQpIHByb2dyYW0gYW5kIGNvbnRpbnVlcyB0byBiZSBtb25pdG9yZWQgdmlhIEhUIHRlY2hub2xvZ3kuIFRoZSBkYXRhIHNlbnQgYnkgdGhlIFZldGVyYW4gaXMgcmV2aWV3ZWQgYW5kIGFuYWx5emVkIGJ5IHRoZSBIVCBzdGFmZiwgd2hvIHByb3ZpZGUgb25nb2luZyBjYXNlIG1hbmFnZW1lbnQgYW5kIFZldGVyYW4gaGVhbHRoIGVkdWNhdGlvbiB3aGlsZSBjb21tdW5pY2F0aW5nIGFuZCBjb2xsYWJvcmF0aW5nIHdpdGggdGhlIGhlYWx0aCBjYXJlIHRlYW0gYXMgYXBwcm9wcmlhdGUuIFRoaXMgbm90ZSBjb3ZlcnMgYSB0b3RhbCBvZiAzMCBtaW51dGVzIGZvciB0aGUgbW9udGggbW9uaXRvcmVkLg0KTW9udGggbW9uaXRvcmVkOiBEZWNlbWJlciAyMDIzDQovZXMvIEFORFJFIFlPVU5HDQpNU04sIFJOIEhvbWUgVGVsZWhlYWx0aCBDYXJlIENvb3JkaW5hdG9yDQpTaWduZWQ6IDEyLzI4LzIwMjMgMDY6NTk=',
              title: 'HT MONTHLY MONITOR NOTE',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    // discharge_summary
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1102',
      resource: {
        id: '123410',
        meta: {
          versionId: '2',
          lastUpdated: '2024-05-03T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.552',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Christopher Wallace',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'DOE,JOHN',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5281877',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '18842-5',
              display: 'Discharge summary',
            },
          ],
          text: 'DISCHARGE SUMMARY',
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2023-03-10T09:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2023-11-30T09:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IERJU0NIQVJHRSBTVU1NQVJZDQpTVEFOREFSRCBUSVRMRTogRElTQ0hBUkdFIFNVTU1BUlkNCkRBVEUgT0YgTk9URTogTk9WIDMwLCAyMDIzQDEwOjEyIEVOVFJZIERBVEU6IE5PViAzMCwgMjAyM0AxMDoxMjo1NA0KQVVUSE9SOiBDSFJJU1RPUEhFUiBXQUxMQUNFIEVYUCBDT1NJR05FUjoNClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEDQpESVNDSEFSR0UgU1VNTUFSWToNClZJVEFMIFNJR05TIE1PTklUT1JJTkcNCkRhdGUgYW5kIFRpbWU6MTEvMzAvMjAyMyBAIDA5NDkNCkJsb29kIHByZXNzdXJlIDogMTIyLzg3bW0gSEcNClB1bHNlIHJhdGUgOiA4OHBlciBtaW4NClJlc3BpcmF0b3J5IHJhdGUgOiAxN3BlciBtaW4NClRlbXBlcmF0dXJlIDogOTcuN0YNCk8yIFNhdHVyYXRpb24gOiAxMDBwZXJjZW50DQoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqDQpQb3N0IEFuZXN0aGVzaWEgU2VkYXRpb24gU2NvcmUgLSBQaGFzZSAxDQpQaGFzZSAxIERpc2NoYXJnZSBDcml0ZXJpYQ0KVE9UQUwgU0NPUkU9MTQNCk94eWdlbmF0aW9uDQoyIFBvaW50cyAtIFNwTzIgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDk0JSBvciBiYXNlbGluZSBvbiByb29tIGFpcg0KUEFDVSBSZXNwaXJhdG9yeSBTdGF0dXMNCjIgUG9pbnRzIC0gTm9ybWFsIGJyZWF0aGluZyBhbmQgZGVlcCBjb3VnaCBvbiBjb21tYW5kDQpDaXJjdWxhdG9yeSBTdGF0dXMNCjIgUG9pbnRzIC0gQlAvSFIgbGVzcyB0aGFuIDIwJSBvciAyMCBtbUhnIG9mIGJhc2VsaW5lDQpMZXZlbCBvZiBDb25zY2lvdXNuZXNzDQoyIFBvaW50cyAtIEZ1bGx5IGF3YWtlIG9yIGVhc2lseSBhd2FrZW5lZA0KUGFpbg0KMiBQb2ludHMgLSBNaW5pbWFsIG9yIG5vbmUgLSBQYWluIFNjb3JlIDAtNCBvciBhdCB0b2xlcmFibGUgbGV2ZWwgb3IgYXQgYmFzZWxpbmUNCk5hdXNlYS9Wb21pdGluZw0KMiBQb2ludHMgLSBNaW5pbWFsIG9yIG5vbmUNCkxldmVsIG9mIEFjdGl2aXR5DQoyIFBvaW50cyAtIEFibGUgdG8gbW92ZSBhbGwgZXh0cmVtaXRpZXMgdm9sdW50YXJpbHkgb3Igb24gY29tbWFuZCBvciBtb3ZlcyBhbGwgZXh0cmVtaXRpZXMgd2l0aCB0aGUgZXhjZXB0aW9uIG9mIGV4dHJlbWl0eSB0cmVhdGVkIHdpdGggcGVyaXBoZXJhbCBuZXJ2ZSBibG9jayBvciBwYXRpZW50IGJhc2VsaW5lDQpWQS1QQVMgUGhhc2UgMSB0aW1lIGRvY3VtZW50ZWQNClRpbWU6IDA5NDkNCk51cnNpbmcgTm90ZTpQYXRpZW50IHJlYWR5IGZvciBkaXNjaGFyZ2UuIERpc2NoYXJnZSBpbnN0cnVjdGlvbnMgYW5kIHByb2NlZHVyZSByZXBvcnQgZ2l2ZW4gdG8gcGF0aWVudC4gVGhlIHBhdGllbnQgdmVyYmFsaXplcyB1bmRlcnN0YW5kaW5nIG9mIGluc3RydWN0aW9ucy4NCkVLRzogTm8gYWN1dGUgRUtHIGNoYW5nZXMNClJFU1BJUkFUT1JZOg0KTzIgYWRtaW5pc3RlcmVkOm5vbmUsDQpHVToNClVyaW5lIE91dHB1dDpoYXMgbm90IHZvaWRlZA0KQ29sb3I6IFVyaW5lOm4vYQ0KR0k6DQpOYXVzZWEgOiBObw0KVm9taXRpbmc6IE5vDQpBYmRvbWVuOm5vbi1kaXN0ZW5kZWQNCkJvd2VsIFNvdW5kczpwcmVzZW50DQpJTlRBS0U6DQpQTzogMCBtbA0KSVY6IDUwMG1sDQpUT1RBTDogNTAwbWwNCk9VVFBVVDoNClVyaW5lOiAwbWwNClRPVEFMOiAwbWwNClBBQ1UgRElTQ0hBUkdFIENSSVRFUklBDQpEaXNjaGFyZ2VkIGJ5IGFuZXN0aGVzaW9sb2dpc3QuDQpBbGVydCBhbmQgb3JpZW50ZWQgb3IgYXQgYmFzZWxpbmUuDQpNb3ZlcyBhbGwgZXh0cmVtaXRpZXMgb3IgYXQgYmFzZWxpbmUuDQpWaXRhbCBzaWducyBhcmUgc3RhYmxlIG9yIGF0IGJhc2VsaW5lLg0KTm8gZXhjZXNzaXZlIGJsZWVkaW5nLg0KQWRlcXVhdGUgcGFpbiBjb250cm9sDQovZXMvIENIUklTVE9QSEVSIFdBTExBQ0UNClJOIFNUQUZGDQpTaWduZWQ6IDExLzMwLzIwMjMgMTA6MjM=',
              title: 'DISCHARGE SUMMARY',
              creation: '2023-11-30T09:00:00-05:00',
            },
          },
        ],
        context: {
          period: {
            start: '2023-11-30T08:00:00-05:00',
            end: '2023-11-30T09:00:00-05:00',
          },
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
    // physician_procedure_note
    {
      fullUrl:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/DocumentReference/1000',
      resource: {
        id: '123411',
        meta: {
          versionId: '2',
          lastUpdated: '2024-02-28T12:05:25.407-04:00',
          source: '#YJJUQxzI9g1Bx8zi',
          profile: [
            'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.note',
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
                value: 'HospitalLocationTO.984ZZI',
              },
            ],
            name: 'Washington DC VAMC',
            resourceType: 'Location',
          },
          {
            id: 'Author-0',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: 'Andre Young',
              },
            ],
            resourceType: 'Practitioner',
          },
          {
            id: 'Provider-1',
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.practitioner',
              ],
            },
            identifier: [
              {
                use: 'usual',
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                value: 'AuthorTO.36556',
              },
            ],
            name: [
              {
                text: '',
              },
            ],
            resourceType: 'Practitioner',
          },
        ],
        identifier: [
          {
            use: 'usual',
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            value: 'NoteTO.5298388',
          },
        ],
        status: 'current',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '11506-3',
              display: 'Progress Note',
            },
          ],
        },
        category: [
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
          reference: 'Patient/974',
        },
        date: '2024-02-28T07:00:00-05:00',
        author: [
          {
            reference: '#Author-0',
          },
        ],
        authenticator: {
          extension: [
            {
              url:
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/noteAuthenticatedWhen',
              valueDateTime: '2024-02-28T07:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEhUIE1PTlRITFkgTU9OSVRPUiBOT1RFClNUQU5EQVJEIFRJVExFOiBDQVJFIENPT1JESU5BVElPTiBIT01FIFRFTEVIRUFMVEggU1VNTUFSSVpBVElPTgpEQVRFIE9GIE5PVEU6IEZFQiAyOCwgMjAyNEAwODozMiBFTlRSWSBEQVRFOiBGRUIgMjgsIDIwMjRAMDg6MzI6NTAKQVVUSE9SOiBBTkRSRSBZT1VORyBFWFAgQ09TSUdORVI6ClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEClRoZSBWZXRlcmFuIGlzIGVucm9sbGVkIGluIHRoZSBIb21lIFRlbGVoZWFsdGggKEhUKSBwcm9ncmFtIGFuZCBjb250aW51ZXMgdG8gYmUgbW9uaXRvcmVkIHZpYSBIVCB0ZWNobm9sb2d5LiBUaGUgZGF0YSBzZW50IGJ5IHRoZSBWZXRlcmFuIGlzIHJldmlld2VkIGFuZCBhbmFseXplZCBieSB0aGUgSFQgc3RhZmYsIHdobyBwcm92aWRlIG9uZ29pbmcgY2FzZSBtYW5hZ2VtZW50IGFuZCBWZXRlcmFuIGhlYWx0aCBlZHVjYXRpb24gd2hpbGUgY29tbXVuaWNhdGluZyBhbmQgY29sbGFib3JhdGluZyB3aXRoIHRoZSBoZWFsdGggY2FyZSB0ZWFtIGFzIGFwcHJvcHJpYXRlLiBUaGlzIG5vdGUgY292ZXJzIGEgdG90YWwgb2YgMzAgbWludXRlcyBmb3IgdGhlIG1vbnRoIG1vbml0b3JlZC4KTW9udGggbW9uaXRvcmVkOiBGZWJydWFyeSAyMDI0Ci9lcy8gQU5EUkUgWU9VTkcKTVNOLCBSTiBIb21lIFRlbGVoZWFsdGggQ2FyZSBDb29yZGluYXRvcgpTaWduZWQ6IDAyLzI4LzIwMjQgMDg6MzU=',
              title: 'HT MONTHLY MONITOR NOTE',
              creation: '2023-11-16T14:40:00-05:00',
            },
          },
        ],
        context: {
          related: [
            {
              reference: '#Location-0',
            },
          ],
        },
        resourceType: 'DocumentReference',
      },
      search: {
        mode: 'match',
      },
    },
  ],
  resourceType: 'Bundle',
};

const single = (req, res) => {
  const { id } = req.params;
  const response = all.entry.find(item => {
    return +item.id === +id;
  });
  return res.json(response);
};

module.exports = {
  all,
  single,
};
