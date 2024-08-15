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
          lastUpdated: '2024-02-07T15:44:39.979-05:00',
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
        date: '2024-02-28T09:00:00-05:00',
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
              valueDateTime: '2024-02-28T09:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IENPTlNVTFQgR0kgKEUpClNUQU5EQVJEIFRJVExFOiBHQVNUUk9FTlRFUk9MT0dZIENPTlNVTFQKREFURSBPRiBOT1RFOiBGRUIgMjgsIDIwMjRAMTA6NDAgRU5UUlkgREFURTogRkVCIDI4LCAyMDI0QDEwOjQwOjA3CkFVVEhPUjogQkVUSCBNLiBTTUlUSCBFWFAgQ09TSUdORVI6IEdSRUdPUlkgSE9VU0UsIE0uRC4KVVJHRU5DWTogU1RBVFVTOiBDT01QTEVURUQKKioqIENPTlNVTFQgR0kgKEUpIEhhcyBBRERFTkRBICoqKgpQcm9jZWR1cmUgcGVyZm9ybWVkLiBTZWUgZnVsbCBub3RlIGluIHByb2NlZHVyZSBzZWN0aW9uIG9mIHJlcG9ydHMgdGFiIG9yIGluIHZpc3RhIGltYWdpbmcuCi9lcy8gQkVUSCBNLiBTTUlUSApBVFRFTkRJTkcgUEhZU0lDSUFOClNpZ25lZDogMDIvMjgvMjAyNCAxMDo0MAowMy8wMi8yMDI0IEFEREVORFVNIFNUQVRVUzogQ09NUExFVEVECkNvbG9ub3Njb3B5IEdBUCBSZW1pbmRlcjoKUmVjb21tZW5kYXRpb25zIGFyZSBuZWVkZWQgaW4gdGhlIGNsaW5pY2FsIHJlbWluZGVyIHN5c3RlbSBmb2xsb3dpbmcgdGhlIHBhdGllbnQncyBtb3N0IHJlY2VudCBjb2xvcmVjdGFsIGNhbmNlciBzY3JlZW5pbmcvc3VydmVpbGxhbmNlIHRlc3QKKENvbG9ub3Njb3B5LCBTaWdtb2lkb3Njb3B5IG9yIENUIENvbG9ub2dyYXBoeSkKQ29sb25vc2NvcHkgcmVtaW5kZXIgc2V0IDcgeWVhcnMgZnJvbSBNQVIgMDIsIDIwMjQuCi9lcy8gQkVUSCBNLiBTTUlUSA==',
              title: 'CONSULT GI (E)',
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
        date: '2024-02-28T08:00:00-05:00',
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
              valueDateTime: '2024-02-28T08:00:00-05:00',
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
        date: '2024-02-22T07:00:00-05:00',
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
        date: '2024-01-30T12:00:00-05:00',
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
        date: '2024-01-30T10:00:00-05:00',
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
              valueDateTime: '2024-01-30T10:00:00-05:00',
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
                'TE9DQUwgVElUTEU6IFBBQ1UgTlVSU0lORyBET0NVTUVOVEFUSU9ODQpTVEFOREFSRCBUSVRMRTogTlVSU0lORyBQT1NUIE9QRVJBVElWRSBFICYgTSBOT1RFDQpEQVRFIE9GIE5PVEU6IEpBTiAwOCwgMjAyNEAxMDoxMiBFTlRSWSBEQVRFOiBKQU4gMDgsIDIwMjRAMTA6MTI6NTQNCkFVVEhPUjogREFOQSBPV0VOUyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KUE9TVC1BTkVTVEhFU0lBIE5VUlNJTkcgQVNTRVNTTUVOVCBBTkQgU1VNTUFSWSBOT1RFDQpJLklOVFJBLU9QRVJBVElWRSBEQVRBOg0KU2VlIEFuZXN0aGVzaWEgSW50cmEtT3BlcmF0aXZlIEZsb3dzaGVldC9Ob3Rlcy4NCkhhbmQtb2ZmIGluZm9ybWF0aW9uIGZyb206IERSLiBBbmRlcnNlbg0KUHJlLW9wIEJQOiAxMzkvOTJtbSBIRw0KSUkuIFBPU1QtT1AgTlVSU0lORyBTVU1NQVJZDQpQUk9DRURVUkU6IENPTE9OT1NDT1BZDQpBTkVTVEhFU0lBOk1vbml0b3JlZCBBbmVzdGhlc2lhIENhcmUNCkFETUlTU0lPTiBBU1NFU1NNRU5UOkFkbWlzc2lvbiBBc3Nlc3NtZW50DQpEYXRlIGFuZCBUaW1lOjEvOC8yMDI0IEAgMDkxOQ0KVklUQUwgU0lHTlMgTU9OSVRPUklORzoNCkJsb29kIHByZXNzdXJlIDogMTA3LzU5bW0gSEcNClB1bHNlIHJhdGUgOiA3N3BlciBtaW4NClJlc3BpcmF0b3J5IHJhdGUgOiAxNXBlciBtaW4NClRlbXBlcmF0dXJlIDogOTcuN0YNCk8yIFNhdHVyYXRpb24gOiAxMDBwZXJjZW50IG9uIDZMIHZpYSBGTQ0KUG9zdCBBbmVzdGhlc2lhIFNlZGF0aW9uIFNjb3JlIC0gUGhhc2UgMQ0KUGhhc2UgMSBEaXNjaGFyZ2UgQ3JpdGVyaWENClRPVEFMIFNDT1JFPTEyDQpPeHlnZW5hdGlvbg0KMSBQb2ludCAtIFNwTzIgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDk0JSBvciBiYXNlbGluZSBtaW51cyAyJSB3aXRoIG94eWdlbg0KUEFDVSBSZXNwaXJhdG9yeSBTdGF0dXMNCjIgUG9pbnRzIC0gTm9ybWFsIGJyZWF0aGluZyBhbmQgZGVlcCBjb3VnaCBvbiBjb21tYW5kDQpDaXJjdWxhdG9yeSBTdGF0dXMNCjIgUG9pbnRzIC0gQlAvSFIgbGVzcyB0aGFuIDIwJSBvciAyMCBtbUhnIG9mIGJhc2VsaW5lDQpMZXZlbCBvZiBDb25zY2lvdXNuZXNzDQoxIFBvaW50IC0gQXJvdXNhYmxlIGJ1dCBkZWxheWVkDQpQYWluDQoyIFBvaW50cyAtIE1pbmltYWwgb3Igbm9uZSAtIFBhaW4gU2NvcmUgMC00IG9yIGF0IHRvbGVyYWJsZSBsZXZlbCBvciBhdCBiYXNlbGluZQ0KTmF1c2VhL1ZvbWl0aW5nDQoyIFBvaW50cyAtIE1pbmltYWwgb3Igbm9uZQ0KTGV2ZWwgb2YgQWN0aXZpdHkNCjIgUG9pbnRzIC0gQWJsZSB0byBtb3ZlIGFsbCBleHRyZW1pdGllcyB2b2x1bnRhcmlseSBvciBvbiBjb21tYW5kIG9yIG1vdmVzIGFsbCBleHRyZW1pdGllcyB3aXRoIHRoZSBleGNlcHRpb24gb2YgZXh0cmVtaXR5IHRyZWF0ZWQgd2l0aCBwZXJpcGhlcmFsIG5lcnZlIGJsb2NrIG9yIHBhdGllbnQgYmFzZWxpbmUNClZBLVBBUyBQaGFzZSAxIHRpbWUgZG9jdW1lbnRlZA0KVGltZTogMDkxOQ0KTnVyc2luZyBOb3RlOlBhdGllbnQgcmVjZWl2ZWQgZm9ybSBhbmVzdGhlc2lhIHByb3ZpZGVyLiBBbGVydCBhbmQgYXJvdXNhYmxlLg0KVml0YWwgc2lnbnMNCnN0YWJsZSwgd2lsbCBjb250aW51ZSB0byBtb25pdG9yLg0KRUtHOiBOb3JtYWwgU2ludXMNCkRldmljZTpOL0ENClBVTE1PTkFSWToNCk8yIGRlbGl2ZXJlZDogbm9uZQ0KQWlyd2F5IDogUm9vbSBhaXINCkJyZWF0aCBTb3VuZHM6IGNsZWFyDQpDb3VnaCA6IG5vbmUNCkxJTkVTL0NBVEhFVEVSUy9EUkVTU0lOR1MNCklWIFNpdGVzOiByaWdodCBoYW5kLA0KSGVwbG9jazogTmVlZGxlL2NhdGhldGVyIGdhdWdlOjIwDQpTT0xVVElPTlM6DQpDcnlzdGFsbG9pZDoNClR5cGU6IHBsYXNtYWx5dGUNCkFtb3VudCByZW1haW5pbmc6NTAwbWwNClJhdGU6MTAwIG1sL2hvdXINCklWLiBQTEFOIE9GIENBUkU6IEltcGxlbWVudCB0aGUgYXBwcm9wcmlhdGUgY2FyZSBwbGFuIGZvciBpZGVudGlmaWVkIHBhdGllbnQgcHJvYmxlbXMuDQpQUk9CTEVNOiBQT1RFTlRJQUwgQUxURVJFRCBQSFlTSU9MT0dJQyBGVU5DVElPTlMNCkVYUEVDVEVEIE9VVENPTUU6IFBhdGllbnQgd2lsbCBoYXZlIHN0YWJsZSB2aXRhbCBzaWducyB3aXRoaW4gaGlzL2hlciBub3JtYWwgcmFuZ2UuDQpOVVJTSU5HIElOVEVSVkVOVElPTlM6DQotIE1vbml0b3Igdml0YWwgc2lnbnMgb24gYWRtaXNzaW9uLiwgZHVyaW5nIHVuaXQgc3RheSwgYW5kIG9uIGRpc2NoYXJnZSBwZXIgUEFDVSBwcm90b2NvbC4NCi0gT3RoZXI6IHNlZSBQQUNVIFByb3RvY29sLg0KUFJPQkxFTTogQU5YSUVUWSBBTkQgS05PV0xFREdFIERFRklDSVQgUkVMQVRFRCBUTyBTVVJHRVJZL1BST0NFRFVSRQ0KRVhQRUNURUQgT1VUQ09NRToNCjEuIFBhdGllbnQvU08gdmVyYmFsaXplcyBhbmQgZGVtb25zdHJhdGVzIHVuZGVyc3RhbmRpbmcgb2Y6DQotIGNvbXBsZXRlZCBwcm9jZWR1cmUvc3VyZ2VyeS4NCi0gT1IvUEFDVSBleHBlcmllbmNlLg0KLSBQb3N0LXByb2NlZHVyZSBhbmQgcG9zdC1vcGVyYXRpdmUgY2FyZS4NCi0gcHVsbW9uYXJ5IHRvaWxldCwgbGVnIGV4ZXJjaXNlcywgYW5kIG90aGVyIGFwcHJvcHJpYXRlIHBvc3QtcHJvY2VkdXJlIGFuZCBwb3N0LW9wZXJhdGl2ZSBpbnN0cnVjdGlvbnMuDQoyLiBQYXRpZW50IHVzZXMgYXBwcm9wcmlhdGUgYW5kIGFnZS1yZWxhdGVkIGNvcGluZyBtZWNoYW5pc21zLg0KUFJPQkxFTTogUE9URU5USUFMIEZPUiBDT01QTElDQVRJT05TIFBPU1QtT1BFUkFUSU9OL1BST0NFRFVSRQ0KRVhQRUNURUQgT1VUQ09NRTogVGhlIHBhdGllbnQgd2lsbCBoYXZlOg0KLSBzdGFibGUgdml0YWwgc2lnbnMgb3IgYXQgYmFzZWxpbmUNCi0gdGVtcGVyYXR1cmUgYWJvdmUgOTYuOCBGIGFuZCBiZWxvdyAxMDEuNSBGIG9yIGF0IGJhc2VsaW5lDQotIFBBUiBTQ09SRSA5IG9yIGF0IGJhc2VsaW5lLg0KLSBDbGVhciBsdW5ncywgbm8gZHlzcG5lYSwgb3IgYXQgYmFzZWxpbmUNCk5VUlNJTkcgSU5URVJWRU5USU9OUzogSW1wbGVtZW50IGFwcHJvcHJpYXRlIHByb3RvY29sIGZvciBsZXZlbCBvZiBjYXJlLg0KUFJPQkxFTTogUEFJTiBSRUxBVEVEIFRPIFNVUkdFUlkgT1IgUFJPQ0VEVVJFDQpFWFBFQ1RFRCBPVVRDT01FOg0KLSBQYXRpZW50IHJlcG9ydHMgcGFpbiBpbnRlbnNpdHkgbGVzcyB0aGFuIDQgKHNjYWxlIDAtMTApIG9yIGF0IGJhc2VsaW5lDQotIENvbW11bmljYXRlcyBmZWVsaW5ncyBvZiBjb21mb3J0IGFuZC9vciByZWxpZWYgb2YgcGFpbiBhbmQgZGlzY29tZm9ydC4NCi0gUGF0aWVudCBjYW4gYXNzaXN0IHdpdGggQURMcyBhbmQgdHJlYXRtZW50cyBhdCBsZXZlbCBvZiBhYmlsaXR5Lg0KLSBEZW1vbnN0cmF0ZXMgYWJpbGl0eSB0byBpbXBsZW1lbnQgcmVsaWVmIG1lYXN1cmVzLg0KLSBBYnNlbmNlIG9mIHNpZ25zIGFuZCBzeW1wdG9tcyBvZiBhZHZlcnNlIHJlYWN0aW9ucyBmcm9tIG1lZGljYXRpb24uDQpOVVJTSU5HIElOVEVSVkVOVElPTlM6DQotIFVzZSBudW1lcmljIG9yIHZpc3VhbCBwYWluIHNjYWxlIHRvIGFzc2VzcyBwYWluIHBlciBQQUNVIHByb3RvY29sLg0KLSBBbnRpY2lwYXRlIG5lZWQgZm9yIGFuZCBwcm92aWRlIHBhaW4gcmVsaWVmLg0KLSBBZG1pbmlzdGVyIHBhaW4gbWVkaWNhdGlvbiBhcyBwcmVzY3JpYmVkLg0KLSBPZmZlciBhbHRlcm5hdGl2ZSBwYWluIGNvbnRyb2wgbWVhc3VyZXMgZm9yIGNvbWZvcnQuDQotIERlY3JlYXNlIGFueGlldHktcHJvZHVjaW5nIHN0aW11bGkuDQotIENvbnN1bHQgQW5lc3RoZXNpb2xvZ2lzdCBvciBkZXNpZ25hdGUgYW5kL29yIHBhaW4gbWFuYWdlbWVudCBjb25zdWx0YXRpdmUgc2VydmljZSBmb3IgZGlmZmljdWx0aWVzIGluIG1hbmFnaW5nIHBhaW4uDQpQQUNVIE5VUlNJTkcgUFJPR1JFU1MgU1VNTUFSWQ0KVklUQUwgU0lHTlMgTU9OSVRPUklORw0KRGF0ZSBhbmQgVGltZToxLzgvMjAyNCBAIDA5MzQNCkJsb29kIHByZXNzdXJlIDogMTE5LzY3bW0gSEcNClB1bHNlIHJhdGUgOiA3NXBlciBtaW4NClJlc3BpcmF0b3J5IHJhdGUgOiAxN3BlciBtaW4NCk8yIFNhdHVyYXRpb24gOiAxMDBwZXJjZW50DQoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqDQpQb3N0IEFuZXN0aGVzaWEgU2VkYXRpb24gU2NvcmUgLSBQaGFzZSAxDQpQaGFzZSAxIERpc2NoYXJnZSBDcml0ZXJpYQ0KVE9UQUwgU0NPUkU9MTQNCk94eWdlbmF0aW9uDQoyIFBvaW50cyAtIFNwTzIgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDk0JSBvciBiYXNlbGluZSBvbiByb29tIGFpcg0KUEFDVSBSZXNwaXJhdG9yeSBTdGF0dXMNCjIgUG9pbnRzIC0gTm9ybWFsIGJyZWF0aGluZyBhbmQgZGVlcCBjb3VnaCBvbiBjb21tYW5kDQpDaXJjdWxhdG9yeSBTdGF0dXMNCjIgUG9pbnRzIC0gQlAvSFIgbGVzcyB0aGFuIDIwJSBvciAyMCBtbUhnIG9mIGJhc2VsaW5lDQpMZXZlbCBvZiBDb25zY2lvdXNuZXNzDQoyIFBvaW50cyAtIEZ1bGx5IGF3YWtlIG9yIGVhc2lseSBhd2FrZW5lZA0KUGFpbg0KMiBQb2ludHMgLSBNaW5pbWFsIG9yIG5vbmUgLSBQYWluIFNjb3JlIDAtNCBvciBhdCB0b2xlcmFibGUgbGV2ZWwgb3IgYXQNCmJhc2VsaW5lDQpOYXVzZWEvVm9taXRpbmcNCjIgUG9pbnRzIC0gTWluaW1hbCBvciBub25lDQpMZXZlbCBvZiBBY3Rpdml0eQ0KMiBQb2ludHMgLSBBYmxlIHRvIG1vdmUgYWxsIGV4dHJlbWl0aWVzIHZvbHVudGFyaWx5IG9yIG9uIGNvbW1hbmQgb3IgbW92ZXMgYWxsIGV4dHJlbWl0aWVzIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBleHRyZW1pdHkgdHJlYXRlZCB3aXRoIHBlcmlwaGVyYWwgbmVydmUgYmxvY2sgb3IgcGF0aWVudCBiYXNlbGluZQ0KVkEtUEFTIFBoYXNlIDEgdGltZSBkb2N1bWVudGVkDQpUaW1lOiAwOTM0DQpOdXJzaW5nIE5vdGU6UGF0aWVudCByZXN0aW5nIGNvbWZvcnRhYmx5IHBhc3NpbmcgZmxhdHVsZW5jZSwgbm8gY29tcGxhaW50cyBhdCB0aGlzIHRpbWUsIHJlYWR5IGZvciBkaXNjaGFyZ2UuDQpESVNDSEFSR0UgU1VNTUFSWToNClZJVEFMIFNJR05TIE1PTklUT1JJTkcNCkRhdGUgYW5kIFRpbWU6MS84LzIwMjQgQCAwOTQ5DQpCbG9vZCBwcmVzc3VyZSA6IDEyMi84N21tIEhHDQpQdWxzZSByYXRlIDogODhwZXIgbWluDQpSZXNwaXJhdG9yeSByYXRlIDogMTdwZXIgbWluDQpUZW1wZXJhdHVyZSA6IDk3LjdGDQpPMiBTYXR1cmF0aW9uIDogMTAwcGVyY2VudA0KKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KUG9zdCBBbmVzdGhlc2lhIFNlZGF0aW9uIFNjb3JlIC0gUGhhc2UgMQ0KUGhhc2UgMSBEaXNjaGFyZ2UgQ3JpdGVyaWENClRPVEFMIFNDT1JFPTE0DQpPeHlnZW5hdGlvbg0KMiBQb2ludHMgLSBTcE8yIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byA5NCUgb3IgYmFzZWxpbmUgb24gcm9vbSBhaXINClBBQ1UgUmVzcGlyYXRvcnkgU3RhdHVzDQoyIFBvaW50cyAtIE5vcm1hbCBicmVhdGhpbmcgYW5kIGRlZXAgY291Z2ggb24gY29tbWFuZA0KQ2lyY3VsYXRvcnkgU3RhdHVzDQoyIFBvaW50cyAtIEJQL0hSIGxlc3MgdGhhbiAyMCUgb3IgMjAgbW1IZyBvZiBiYXNlbGluZQ0KTGV2ZWwgb2YgQ29uc2Npb3VzbmVzcw0KMiBQb2ludHMgLSBGdWxseSBhd2FrZSBvciBlYXNpbHkgYXdha2VuZWQNClBhaW4NCjIgUG9pbnRzIC0gTWluaW1hbCBvciBub25lIC0gUGFpbiBTY29yZSAwLTQgb3IgYXQgdG9sZXJhYmxlIGxldmVsIG9yIGF0IGJhc2VsaW5lDQpOYXVzZWEvVm9taXRpbmcNCjIgUG9pbnRzIC0gTWluaW1hbCBvciBub25lDQpMZXZlbCBvZiBBY3Rpdml0eQ0KMiBQb2ludHMgLSBBYmxlIHRvIG1vdmUgYWxsIGV4dHJlbWl0aWVzIHZvbHVudGFyaWx5IG9yIG9uIGNvbW1hbmQgb3IgbW92ZXMgYWxsIGV4dHJlbWl0aWVzIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBleHRyZW1pdHkgdHJlYXRlZCB3aXRoIHBlcmlwaGVyYWwgbmVydmUgYmxvY2sgb3IgcGF0aWVudCBiYXNlbGluZQ0KVkEtUEFTIFBoYXNlIDEgdGltZSBkb2N1bWVudGVkDQpUaW1lOiAwOTQ5DQpOdXJzaW5nIE5vdGU6UGF0aWVudCByZWFkeSBmb3IgZGlzY2hhcmdlLiBEaXNjaGFyZ2UgaW5zdHJ1Y3Rpb25zIGFuZCBwcm9jZWR1cmUgcmVwb3J0IGdpdmVuIHRvIHBhdGllbnQuIFRoZSBwYXRpZW50IHZlcmJhbGl6ZXMgdW5kZXJzdGFuZGluZyBvZiBpbnN0cnVjdGlvbnMuDQpFS0c6IE5vIGFjdXRlIEVLRyBjaGFuZ2VzDQpSRVNQSVJBVE9SWToNCk8yIGFkbWluaXN0ZXJlZDpub25lLA0KR1U6DQpVcmluZSBPdXRwdXQ6aGFzIG5vdCB2b2lkZWQNCkNvbG9yOiBVcmluZTpuL2ENCkdJOg0KTmF1c2VhIDogTm8NClZvbWl0aW5nOiBObw0KQWJkb21lbjpub24tZGlzdGVuZGVkDQpCb3dlbCBTb3VuZHM6cHJlc2VudA0KSU5UQUtFOg0KUE86IDAgbWwNCklWOiA1MDBtbA0KVE9UQUw6IDUwMG1sDQpPVVRQVVQ6DQpVcmluZTogMG1sDQpUT1RBTDogMG1sDQpQQUNVIERJU0NIQVJHRSBDUklURVJJQQ0KRGlzY2hhcmdlZCBieSBhbmVzdGhlc2lvbG9naXN0Lg0KQWxlcnQgYW5kIG9yaWVudGVkIG9yIGF0IGJhc2VsaW5lLg0KTW92ZXMgYWxsIGV4dHJlbWl0aWVzIG9yIGF0IGJhc2VsaW5lLg0KVml0YWwgc2lnbnMgYXJlIHN0YWJsZSBvciBhdCBiYXNlbGluZS4NCk5vIGV4Y2Vzc2l2ZSBibGVlZGluZy4NCkFkZXF1YXRlIHBhaW4gY29udHJvbA0KL2VzLyBEQU5BIE9XRU5TDQpSTiBTVEFGRg0KU2lnbmVkOiAwMS8wOC8yMDI0IDEwOjIz',
              title: 'PACU NURSING DOCUMENTATION',
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
        date: '2024-01-08T09:00:00-05:00',
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
              title: 'Discharge Summary',
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
        date: '2023-12-28T10:00:00-05:00',
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
        date: '2023-11-30T09:00:00-05:00',
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
              title: 'Discharge Summary',
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
        date: '2023-11-28T07:00:00-05:00',
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
              valueDateTime: '2023-11-28T07:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IEhUIE1PTlRITFkgTU9OSVRPUiBOT1RFDQpTVEFOREFSRCBUSVRMRTogQ0FSRSBDT09SRElOQVRJT04gSE9NRSBURUxFSEVBTFRIIFNVTU1BUklaQVRJT04NCkRBVEUgT0YgTk9URTogTk9WIDI4LCAyMDIzQDA4OjMyIEVOVFJZIERBVEU6IE5PViAyOCwgMjAyM0AwODozMjo1MA0KQVVUSE9SOiBBTkRSRSBZT1VORyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KVGhlIFZldGVyYW4gaXMgZW5yb2xsZWQgaW4gdGhlIEhvbWUgVGVsZWhlYWx0aCAoSFQpIHByb2dyYW0gYW5kIGNvbnRpbnVlcyB0byBiZSBtb25pdG9yZWQgdmlhIEhUIHRlY2hub2xvZ3kuIFRoZSBkYXRhIHNlbnQgYnkgdGhlIFZldGVyYW4gaXMgcmV2aWV3ZWQgYW5kIGFuYWx5emVkIGJ5IHRoZSBIVCBzdGFmZiwgd2hvIHByb3ZpZGUgb25nb2luZyBjYXNlIG1hbmFnZW1lbnQgYW5kIFZldGVyYW4gaGVhbHRoIGVkdWNhdGlvbiB3aGlsZSBjb21tdW5pY2F0aW5nIGFuZCBjb2xsYWJvcmF0aW5nIHdpdGggdGhlIGhlYWx0aCBjYXJlIHRlYW0gYXMgYXBwcm9wcmlhdGUuIFRoaXMgbm90ZSBjb3ZlcnMgYSB0b3RhbCBvZiAzMCBtaW51dGVzIGZvciB0aGUgbW9udGggbW9uaXRvcmVkLg0KTW9udGggbW9uaXRvcmVkOiBOb3ZlbWJlciAyMDIzDQovZXMvIEFORFJFIFlPVU5HDQpNU04sIFJOIEhvbWUgVGVsZWhlYWx0aCBDYXJlIENvb3JkaW5hdG9yDQpTaWduZWQ6IDExLzI4LzIwMjMgMDg6MzU=',
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
        id: '123412',
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
        date: '2023-10-26T12:00:00-05:00',
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
              valueDateTime: '2023-10-26T12:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IFBSSU1BUlkgQ0FSRSBOVVJTSU5HIFRSSUFHRSBOT1RFDQpTVEFOREFSRCBUSVRMRTogUFJJTUFSWSBDQVJFIE5VUlNJTkcgVFJJQUdFIE5PVEUNCkRBVEUgT0YgTk9URTogT0NUIDI2LCAyMDIzQDE0OjE2IEVOVFJZIERBVEU6IE9DVCAyNiwgMjAyM0AxNDoxNjo1Nw0KQVVUSE9SOiBDQUxWSU4gQlJPQURVUyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KUGF0aWVudCBhZ2U6IDYyIHkuby4NCkNoaWVmIGNvbXBsYWludCAoaW5jbHVkZSBkYXRlIG9mIG9uc2V0KTogbm8gYy9vIHBhaW4NClZpdGFsIHNpZ25zOg0KVDogOTcuMiBGIFszNi4yIENdICgxMC8yNi8yMDIzIDE0OjE1KQ0KQlA6IDEzNi84NCAoMTAvMjYvMjAyMyAxNDoxNSkNClA6IDgyICgxMC8yNi8yMDIzIDE0OjE1KQ0KUlI6IDE2ICgxMC8yNi8yMDIzIDE0OjE1KQ0KUGFpbiBTY29yZTogMCAoMTAvMjYvMjAyMyAxNDoxNSkNCk8yIHNhdCduOiBTYU8yLU06IE5vIGxhYiBkYXRhIGF2YWlsYWJsZQ0KVGhlIHBhdGllbnQgd2FzIGFza2VkLCAiT3ZlciB0aGUgcGFzdCB0d28gd2Vla3MsIGhvdyBvZnRlbiBoYXZlIHlvdSBiZWVuIGJvdGhlcmVkIGJ5IHRob3VnaHRzIHRoYXQgeW91IHdvdWxkIGJlIGJldHRlciBvZmYgZGVhZCBvciBvZiBodXJ0aW5nIHlvdXJzZWxmIGluIHNvbWUgd2F5PyINCk5vdCBBdCBBbGwNCkFkdmFuY2VkIERpcmVjdGl2ZXMgRWR1Y2F0aW9uOg0KUkVRVUlSRUQgSEVBTFRIIEVEVUNBVElPTg0KQWR2YW5jZSBEaXJlY3RpdmVzIFNjcmVlbiBhbmQgRWR1Y2F0aW9uDQpIYXZlIGFuIGFkdmFuY2UgZGlyZWN0aXZlPw0KWWVzLg0KU2V4dWFsIE9yaWVudGF0aW9uOg0KVGhlIHBhdGllbnQgdGhpbmtzIG9mIHRoZWlyIHNleHVhbCBvcmllbnRhdGlvbiBhczoNClN0cmFpZ2h0IG9yIEhldGVyb3NleHVhbA0KRmFsbCBSaXNrIEFzc2Vzc21lbnQgT3V0cGF0aWVudDoNCkZhbGwgcmlzayBpbmZvcm1hdGlvbiB3YXMgb2J0YWluZWQgZnJvbTogcGF0aWVudA0KUGF0aWVudCBoYXMgTk8gaGlzdG9yeSBvZiBmYWxscyBpbiB0aGUgcGFzdCAzIG1vbnRocy4NClRoZSBwYXRpZW50IGhhcyB0aGUgZm9sbG93aW5nIHJpc2sgZmFjdG9yczoNCkZBTEwgUklTSyBBU1NFU1NNRU5UIE9VVENPTUU6DQpJTlRFUlZFTlRJT05TOg0KSG9tZWxlc3NuZXNzL0Zvb2QgSW5zZWN1cml0eSBTY3JlZW46DQpJbiB0aGUgcGFzdCAyIG1vbnRocywgaGF2ZSB5b3UgYmVlbiBsaXZpbmcgaW4gc3RhYmxlIGhvdXNpbmcgdGhhdCB5b3Ugb3duLCByZW50LCBvciBzdGF5IGluIGFzIHBhcnQgb2YgYSBob3VzZWhvbGQ/IFllcyAtIExpdmluZyBpbiBzdGFibGUgaG91c2luZy4NCkFyZSB5b3Ugd29ycmllZCBvciBjb25jZXJuZWQgdGhhdCBpbiB0aGUgbmV4dCAyIG1vbnRocyB5b3UgbWF5IE5PVCBoYXZlIHN0YWJsZSBob3VzaW5nIHRoYXQgeW91IG93biwgcmVudCwgb3Igc3RheSBpbiBhcyBwYXJ0IG9mIGEgaG91c2Vob2xkPw0KTm8gLSBOb3Qgd29ycmllZCBhYm91dCBob3VzaW5nIG5lYXIgZnV0dXJlDQpUaGUgVmV0ZXJhbiByZXBvcnRzIHRoZSBmb2xsb3dpbmc6DQpXaXRoaW4gdGhlIHBhc3QgMTIgbW9udGhzLCB5b3Ugd29ycmllZCB3aGV0aGVyIHlvdXIgZm9vZCB3b3VsZCBydW4gb3V0IGJlZm9yZSB5b3UgZ290IG1vbmV5IHRvIGJ1eSBtb3JlLg0KTmV2ZXIgdHJ1ZQ0KV2l0aGluIHRoZSBwYXN0IDEyIG1vbnRocywgdGhlIGZvb2QgeW91IGJvdWdodCBqdXN0IGRpZG4ndCBsYXN0IGFuZCB5b3UgZGlkbid0IGhhdmUgbW9uZXkgdG8gZ2V0IG1vcmUuDQpOZXZlciB0cnVlDQpIVE4gTGlmZXN0eWxlIEVkdWNhdGlvbjoNClRoZSBwYXRpZW50IHdhcyBlZHVjYXRlZCBvbiB0aGUgcm9sZSBvZiB3ZWlnaHQgY29udHJvbCwgbG93IHNhbHQgZGlldCBhbmQgYSBoZWFydCBoZWFsdGh5IGRpZXQgaW4gdGhlIGNvbnRyb2wgb2YgYmxvb2QgcHJlc3N1cmUuIFRoZSBpbXBvcnRhbmNlIG9mIHJlZ3VsYXIgYWVyb2JpYyBleGVyY2lzZSAzMCBtaW51dGVzIGF0IGxlYXN0IDMtNCB0aW1lcyBhIHdlZWsgd2FzIGFsc28gcmV2aWV3ZWQgd2l0aCB0aGUgcGF0aWVudC4NClRoZSBwYXRpZW50IHdhcyBlZHVjYXRlZCBvbiB0aGUgYmVuZWZpdHMgb2YgcmVndWxhciBleGVyY2lzZSBmb3IgdGhlIGNvbnRyb2wgb2YgYmxvb2QgcHJlc3N1cmUuDQpUaGUgcGF0aWVudCB3YXMgZWR1Y2F0ZWQgb24gdGhlIHJvbGUgb2YgbnV0cml0aW9uIGFuZCB3ZWlnaHQgY29udHJvbCBpbiB0aGUgbWFuYWdlbWVudCBvZiBoeXBlcnRlbnNpb24uDQpMRUFSTklORyBORUVEUyAoUk4gT05MWSk6DQooVG8gYmUgY29tcGxldGVkIGJ5IFJOKS4NCkZhbWlseS9TaWduaWZpY2FudCBPdGhlciB0byBiZSBpbmNsdWRlZCBpbiB0ZWFjaGluZy9sZWFybmluZyBwcm9jZXNzPw0KTm8NCkluIHdoYXQgbGFuZ3VhZ2UgZG8geW91IHByZWZlciB0byBkaXNjdXNzIHlvdXIgaGVhbHRoIGNhcmU/DQpFbmdsaXNoDQpPVEhFUiBGQUNUT1JTIElNUEFDVElORyBPTiBMRUFSTklORzoNCkFyZSB0aGVyZSBhbnkgaGVhbHRoIGNhcmUgcHJvY2VkdXJlcyBvciB0ZXN0cyB0aGF0IHlvdSB3b3VsZCBub3QgYWdyZWUgdG8gaGF2ZSwgZS5nLCBibG9vZCB0cmFuc2Z1c2lvbnM/IE5vDQpBcmUgdGhlcmUgYW55IHJlbGlnaW91cyBvciBzcGlyaXR1YWwgb2JzZXJ2YW5jZXMgdGhhdCB3b3VsZCBhZmZlY3QgeW91ciBjYXJlIG9yIHRyZWF0bWVudCwgZS5nLiwgZmFzdGluZyBzZXZlcmFsIGRheXMgcGVyIG1vbnRoIGFuZCBoYXMgdG8gdGFrZSBtZWRpY2F0aW9uIHdpdGggZm9vZD8gTm8NCkJBUlJJRVJTIFRPIFRFQUNISU5HL0xFQVJOSU5HIChlLmcuLCBoZWFyaW5nLCB2aXNpb24sIHBoeXNpY2FsIG9yIGNvZ25pdGl2ZSBpbXBhaXJtZW50KQ0KTm8uDQpQUkVGRVJSRUQgTUVUSE9EIE9GIExFQVJOSU5HOg0KQ29tYmluYXRpb24gb2YgYWJvdmU6DQpXRUlHSFQgJiBOVVRSSVRJT04gU0NSRUVOOg0KV2VpZ2h0IDE4NyBsYiBbODQuODIga2ddICgxMC8yNi8yMDIzIDE0OjE1KQ0KSEVJR0hUIDY5IGluIFsxNzUuMyBjbV0gKDEwLzI2LzIwMjMgMTQ6MTUpDQpCTUkgMjgqDQpCTUkgPT4gMjUuIEEgYnJpZWYgY29udmVyc2F0aW9uIHdpdGggdGhlIHBhdGllbnQgd2FzIGNvbmR1Y3RlZCB0byBwcm92aWRlDQppbmZvcm1hdGlvbiBhYm91dCB0aGUgcGF0aWVudCdzIHdlaWdodCAmIEJNSSB0aGF0IGluZGljYXRlcyBvdmVyd2VpZ2h0L29iZXNpdHksIHRoYXQgdGhlcmUgYXJlIGhlYWx0aCByaXNrcyBhc3NvY2lhdGVkIHdpdGggb3ZlcndlaWdodC9vYmVzaXR5IHN1Y2ggYXMgaHlwZXJ0ZW5zaW9uLCBkaWFiZXRlcywgaGVhcnQgZGlzZWFzZSwgYW5kIHRoYXQgdHJlYXRtZW50IGlzIGF2YWlsYWJsZSBzdWNoIGFzIHRoZSBEQyBWQU1DIE1PVkUgKE1hbmFnaW5nIE92ZXJ3ZWlnaHQvT2Jlc2l0eSBmb3IgVmV0ZXJhbnMgRXZlcnl3aGVyZSkgcHJvZ3JhbS4NCkxldmVsIG9mIFVuZGVyc3RhbmRpbmc6IEdvb2QNClBhdGllbnQgcmVzcG9uc2UgdG8gY29udmVyc2F0aW9uIGFib3V0IHdlaWdodCBtYW5hZ2VtZW50IHRyZWF0bWVudCB3YXM6DQpQYXRpZW50IHJlZnVzZXMgd2VpZ2h0IG1hbmFnZW1lbnQgdHJlYXRtZW50Lg0KTVNUIFNjcmVlbmluZzoNClBhdGllbnQgZGVuaWVzIGV4cGVyaWVuY2luZyBtaWxpdGFyeSBzZXh1YWwgdHJhdW1hIChNU1QpLg0KUGF0aWVudCBFZHVjYXRpb246DQpDaGFyYWN0ZXJpc3RpY3Mgb3IgYmFycmllcnMgdGhhdCBtYXkgYWZmZWN0IHRlYWNoaW5nL2NvbXBsaWFuY2U6DQouLi5QYXRpZW50IGRlbmllcyBhbnkgYmFycmllcnMgdG8gbGVhcm5pbmcgYXQgdGhpcyB0aW1lLg0KUHJlZmVycmVkIE1ldGhvZChzKSBvZiBMZWFybmluZzoNCi4uLlJlYWRpbmcNCi4uLkxpc3RlbmluZw0KLi4uVmlkZW9zDQouLi5Eb2luZw0KUG5ldW1vY29jY2FsIENvbmp1Z2F0ZSBWYWNjaW5lIChQQ1YxNS9QQ1YyMCk6DQpQbmV1bW9jb2NjYWwgdmFjY2luZSBnaXZlbiBwcmV2aW91c2x5IC0gd3JpdHRlbiByZWNvcmRzIGF2YWlsYWJsZQ0KRG9jdW1lbnRlZDogUE5FVU1PQ09DQ0FMIFBPTFlTQUNDSEFSSURFIFBQVjIzDQpIaXN0b3JpY2FsIERhdGUgQWRtaW5pc3RlcmVkOiBBdWcgMTAsIDIwMTANCk91dHNpZGUgTG9jYXRpb246IGRvZA0KSW5mb3JtYXRpb24gU291cmNlOiBTT1VSQ0UgVU5TUEVDSUZJRUQNClRveGljIEV4cG9zdXJlIFNjcmVlbmluZzoNClRoZSBWZXRlcmFuL2NhcmVnaXZlciB3YXMgYXNrZWQgaWYgdGhleSBiZWxpZXZlIHRoZSBWZXRlcmFuIGV4cGVyaWVuY2VkIGFueSB0b3hpYyBleHBvc3VyZShzKSwgc3VjaCBhcyBBaXJib3JuZSBIYXphcmRzIGFuZCBPcGVuIEJ1cm4gUGl0LCBHdWxmIFdhciByZWxhdGVkIGV4cG9zdXJlcywgQWdlbnQgT3JhbmdlLCBSYWRpYXRpb24sIGNvbnRhbWluYXRlZCB3YXRlciBhdCBDYW1wIExlamV1bmUgb3Igb3RoZXIgc3VjaCBleHBvc3VyZXMsIHdoaWxlIHNlcnZpbmcgaW4gdGhlIEFybWVkIEZvcmNlcy4NClZldGVyYW4vY2FyZWdpdmVyIGJlbGlldmVzIHRoZSBWZXRlcmFuIHdhcyBleHBvc2VkIHRvIHRoZSBmb2xsb3dpbmcgd2hpbGUgc2VydmluZyBpbiB0aGUgQXJtZWQgRm9yY2VzOg0KUmFkaWF0aW9uOg0KVmV0ZXJhbi9jYXJlZ2l2ZXIgd2FzIG1hZGUgYXdhcmUgb2YgZWR1Y2F0aW9uYWwgcmVzb3VyY2VzIHRoYXQgaW5jbHVkZXMgaW5mb3JtYXRpb24gb24gdGhlIFJlZ2lzdHJ5IFByb2dyYW0sIHByZXN1bXB0aXZlIGNvbmRpdGlvbnMgYW5kIGhvdyB0byBmaWxlIGEgY2xhaW0uIFByaW50ZWQgaW5mb3JtYXRpb24gd2FzIG9mZmVyZWQgYW5kIHByb3ZpZGVkIGlmIGRlc2lyZWQuDQpPdGhlciBleHBvc3VyZXM6DQpDb21tZW50OiBjaGVtaWNhbA0KVmV0ZXJhbi9jYXJlZ2l2ZXIgd2FzIG1hZGUgYXdhcmUgb2YgZWR1Y2F0aW9uYWwgcmVzb3VyY2VzIGFuZCBwcmludGVkIGluZm9ybWF0aW9uIHdhcyBvZmZlcmVkIGFuZCBwcm92aWRlZCBpZiBkZXNpcmVkLg0KSGVhbHRoL01lZGljYWwgUXVlc3Rpb25zDQpBbGwgcGF0aWVudHMgd2hvIHJlcG9ydCBhIGhlYWx0aC9tZWRpY2FsIGNvbmNlcm4gd2lsbCByZWNlaXZlIGZvbGxvd3VwIGZyb20gYSBjbGluaWNpYW4uIEZvciB1cmdlbnQgb3IgZW1lcmdlbnQgY29uY2VybnMsIHRoZXkgd2VyZSBhZHZpc2VkIHRvIGZvbGxvdyBsb2NhbCBmYWNpbGl0eSBwb2xpY3kuDQpCZW5lZml0cy9DbGFpbXMgUXVlc3Rpb25zDQpWZXRlcmFuL2NhcmVnaXZlciB3YXMgaW5mb3JtZWQgb2YgbG9jYWwgcG9pbnQgb2YgY29udGFjdC4NClZBIEhlYWx0aCBDYXJlIEVucm9sbG1lbnQgYW5kIEVsaWdpYmlsaXR5IFF1ZXN0aW9ucw0KVmV0ZXJhbi9jYXJlZ2l2ZXIgd2FzIGluZm9ybWVkIG9mIGxvY2FsIHBvaW50IG9mIGNvbnRhY3QuDQpSZWdpc3RyeSBRdWVzdGlvbnMNClZldGVyYW4vY2FyZWdpdmVyIHdhcyBpbmZvcm1lZCBvZiBsb2NhbCBwb2ludCBvZiBjb250YWN0Lg0KQ29udGFjdCBpbmZvcm1hdGlvbiBmb3IgbG9jYWwgcmVzb3VyY2VzOiBFbnZpcm9ubWVudGFsIENvb3JkaW5hdG9yIGF0IDIwMi03NDUtODQxOSBvciB2aWEgZW1haWwgQUhPQlBSNjg4QHZhLmdvdi4NClRveGljIEV4cG9zdXJlIFNjcmVlbmluZyBGb2xsb3ctVXAgcmVtaW5kZXIgaXMgbmVlZGVkLg0KTmFtZSBvZiBwZXJzb24gbm90aWZpZWQ6IERyLiBNYXRoZXJzDQovZXMvIENBTFZJTiBCUk9BRFVTDQpSTiBTVEFGRg0KU2lnbmVkOiAxMC8yNi8yMDIzIDE0OjIw',
              title: 'PRIMARY CARE NURSING TRIAGE NOTE',
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
        id: '123413',
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
                text: 'Marshall Mathers',
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
        date: '2023-10-11T12:00:00-05:00',
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
              valueDateTime: '2023-10-11T12:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IFBSSU1BUlkgQ0FSRSBTRUNVUkUgTUVTU0FHSU5HDQpTVEFOREFSRCBUSVRMRTogUFJJTUFSWSBDQVJFIFNFQ1VSRSBNRVNTQUdJTkcNCkRBVEUgT0YgTk9URTogT0NUIDExLCAyMDIzQDA5OjMzIEVOVFJZIERBVEU6IE9DVCAxMSwgMjAyM0AxMDozMzozNw0KQVVUSE9SOiBNQVJTSEFMTCBNQVRIRVJTIEVYUCBDT1NJR05FUjoNClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEDQoqKiogUFJJTUFSWSBDQVJFIFNFQ1VSRSBNRVNTQUdJTkcgSGFzIEFEREVOREEgKioqDQotLS0tLS1PcmlnaW5hbCBNZXNzYWdlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpTZW50OiAwOS8xMi8yMDIzIDExOjUxIEFNIEVUDQpGcm9tOiBQQVQgV0lMU09ODQpUbzogTUFSU0hBTEwgTUFUSEVSUw0KU3ViamVjdDogR2VuZXJhbDpDb250aW51b3VzIGdsdWNvc2UgbW9uaXRvcmluZyAoQ0dNKQ0KRHIuIE1hdGhlcnMNCkZvciBteSBuZXh0IGZvbGxvdyB1cCBhcHBvaW50bWVudCBzY2hlZHVsZWQgaW4gbGF0ZSBPY3RvYmVyIEkgd291bGQgbGlrZSB0byBkaXNjdXNzIHRoZSBwb3NzaWJpbGl0eSBvZiBwdXJzdWluZyBhIENvbnRpbnVvdXMgZ2x1Y29zZSBtb25pdG9yaW5nIChDR00pIHN5c3RlbSBhcyBteSB3aWZlIGFuZCBJIGFyZSBnZXR0aW5nIHRpcmVkIG9mIHRoZSByb3V0aW5lIGZpbmdlciBzdGlja3MuDQpUaGFuayB5b3UgZm9yIHlvdXIgdGltZSBhbmQgSSBsb29rIGZvcndhcmQgdG8gaGVhcmluZyBmcm9tIHlvdSBpbiBPY3RvYmVyLg0KQ29yZGlhbGx5LA0KUGF0IFdpbHNvbg0KLS0tLS0tT3JpZ2luYWwgTWVzc2FnZS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQ0KU2VudDogMDkvMTIvMjAyMyAxMjo1NyBQTSBFVA0KRnJvbTogTUFSU0hBTEwgTUFUSEVSUw0KVG86IFBBVCBXSUxTT04NClN1YmplY3Q6IEdlbmVyYWw6Q29udGludW91cyBnbHVjb3NlIG1vbml0b3JpbmcgKENHTSkNCkdvb2QgYWZ0ZXJub29uIE1yLiBXaWxzb24sDQpXZSB3aWxsIGRpc2N1c3MgdGhlIENHTSBmdXJ0aGVyIGF0IG91ciBhcHBvaW50bWVudCBpbiBPY3RvYmVyLCB0aGFuayB5b3UgZm9yIHRoZSBoZWFkcyB1cC4NCkJlc3QsDQpNYXJzaGFsbCBNYXRoZXJzDQpNLkQuDQotLS0tLS1PcmlnaW5hbCBNZXNzYWdlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpTZW50OiAxMC8xMS8yMDIzIDA5OjQ5IEFNIEVUDQpGcm9tOiBQQVQgV0lMU09ODQpUbzogTUFSU0hBTEwgTUFUSEVSUw0KU3ViamVjdDogR2VuZXJhbDpDb250aW51b3VzIGdsdWNvc2UgbW9uaXRvcmluZyAoQ0dNKQ0KQXR0YWNobWVudHM6IFdpbHNvblBhdF9oZWFsdGgtc3VtbWFyeTIwMjMtMTAtMTEucGRmICg4Mi4xNiBLQikNCkF0dGFjaGluZyBteSBIZWFsdGggU3VtbWFyeSBmcm9tIG15IDEwIE9jdG9iZXIgMjAyMyAoVHVlc2RheSBtb3JuaW5nKSBXYWx0ZXIgUmVlZCBCZXRoZXNkYSBlbmNvdW50ZXIuDQpBbGwgbXkgYmVzdCB0byB5b3UgYW5kIHlvdXJzLg0KQ29yZGlhbGx5LA0KUGF0DQotLS0tLS1PcmlnaW5hbCBNZXNzYWdlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpTZW50OiAxMC8xMS8yMDIzIDEwOjMzIEFNIEVUDQpGcm9tOiBNQVJTSEFMTCBNQVRIRVJTDQpUbzogUEFUIFdJTFNPTg0KU3ViamVjdDogR2VuZXJhbDpDb250aW51b3VzIGdsdWNvc2UgbW9uaXRvcmluZyAoQ0dNKQ0KVGhhbmsgeW91IGZvciB0aGUgdXBkYXRlIE1yLiBXaWxzb24uDQpCZXN0LA0KTWFyc2hhbGwgTWF0aGVycw0KTS5ELg0KL2VzLyBNQVJTSEFMTCBNQVRIRVJTDQpBVFRFTkRJTkcgUEhZU0lDSUFODQpTaWduZWQ6IDEwLzExLzIwMjMgMTA6MzMNCjEwLzExLzIwMjMgQURERU5EVU0gU1RBVFVTOiBDT01QTEVURUQNClJldmlld2VkIGF0dGFjaG1lbnQgV1JOTUMgUENQIDkvMjcvMjAyMyBub3RlDQotQ29udGludWUgTGFudHVzIDE0IHVuaXRzLCBkdWxhZ2x1dGlkZSAxLjVtZyB3ZWVrbHksIGFyZGlhbmNlIDI1IGFuZCBtZXRmb3JtaW4NCjEwMDAgQklEDQovZXMvIE1BUlNIQUxMIE1BVEhFUlMNCkFUVEVORElORyBQSFlTSUNJQU4NClNpZ25lZDogMTAvMTEvMjAyMyAxMDozNQ==',
              title: 'PRIMARY CARE SECURE MESSAGING',
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
        id: '123414',
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
                text: 'Marshall Mathers',
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
        date: '2023-09-12T12:00:00-05:00',
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
              valueDateTime: '2023-09-12T12:00:00-05:00',
            },
          ],
          reference: '#Provider-1',
        },
        content: [
          {
            attachment: {
              contentType: 'text/plain',
              data:
                'TE9DQUwgVElUTEU6IFBSSU1BUlkgQ0FSRSBTRUNVUkUgTUVTU0FHSU5HDQpTVEFOREFSRCBUSVRMRTogUFJJTUFSWSBDQVJFIFNFQ1VSRSBNRVNTQUdJTkcNCkRBVEUgT0YgTk9URTogU0VQIDEyLCAyMDIzQDExOjU3IEVOVFJZIERBVEU6IFNFUCAxMiwgMjAyM0AxMjo1NzozOA0KQVVUSE9SOiBNQVJTSEFMTCBNQVRIRVJTIEVYUCBDT1NJR05FUjoNClVSR0VOQ1k6IFNUQVRVUzogQ09NUExFVEVEDQotLS0tLS1PcmlnaW5hbCBNZXNzYWdlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQpTZW50OiAwOS8xMi8yMDIzIDExOjUxIEFNIEVUDQpGcm9tOiBQQVQgV0lMU09ODQpUbzogTUFSU0hBTEwgTUFUSEVSUw0KU3ViamVjdDogR2VuZXJhbDpDb250aW51b3VzIGdsdWNvc2UgbW9uaXRvcmluZyAoQ0dNKQ0KRHIuIE1hdGhlcnMsDQpGb3IgbXkgbmV4dCBmb2xsb3cgdXAgYXBwb2ludG1lbnQgc2NoZWR1bGVkIGluIGxhdGUgT2N0b2JlciBJIHdvdWxkIGxpa2UgdG8gZGlzY3VzcyB0aGUgcG9zc2liaWxpdHkgb2YgcHVyc3VpbmcgYSBDb250aW51b3VzIGdsdWNvc2UgbW9uaXRvcmluZyAoQ0dNKSBzeXN0ZW0gYXMgbXkgd2lmZSBhbmQgSSBhcmUgZ2V0dGluZyB0aXJlZCBvZiB0aGUgcm91dGluZSBmaW5nZXIgc3RpY2tzLg0KVGhhbmsgeW91IGZvciB5b3VyIHRpbWUgYW5kIEkgbG9vayBmb3J3YXJkIHRvIGhlYXJpbmcgZnJvbSB5b3UgaW4gT2N0b2Jlci4NCkNvcmRpYWxseSwNClBhdCBXaWxzb24NCi0tLS0tLU9yaWdpbmFsIE1lc3NhZ2UtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NClNlbnQ6IDA5LzEyLzIwMjMgMTI6NTcgUE0gRVQNCkZyb206IE1BUlNIQUxMIE1BVEhFUlMNClRvOiBQQVQgV0lMU09ODQpTdWJqZWN0OiBHZW5lcmFsOkNvbnRpbnVvdXMgZ2x1Y29zZSBtb25pdG9yaW5nIChDR00pDQpHb29kIGFmdGVybm9vbiBNci4gV2lsc29uLA0KV2Ugd2lsbCBkaXNjdXNzIHRoZSBDR00gZnVydGhlciBhdCBvdXIgYXBwb2ludG1lbnQgaW4gT2N0b2JlciwgdGhhbmsgeW91IGZvciB0aGUgaGVhZHMgdXAuDQpCZXN0LA0KTWFyc2hhbGwgTWF0aGVycw0KTS5ELg0KL2VzLyBNQVJTSEFMTCBNQVRIRVJTDQpBVFRFTkRJTkcgUEhZU0lDSUFODQpTaWduZWQ6IDA5LzEyLzIwMjMgMTI6NTc=',
              title: 'PRIMARY CARE SECURE MESSAGING',
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
