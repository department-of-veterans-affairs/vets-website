const all = {
  data: [
    {
      id: '76ad925b-0c2c-4401-ac0a-13542d6b6ef5',
      type: 'clinical_note',
      attributes: {
        id: '76ad925b-0c2c-4401-ac0a-13542d6b6ef5',
        name: 'CARE COORDINATION HOME TELEHEALTH DISCHARGE NOTE',
        noteType: 'physician_procedure_note',
        loincCodes: ['11506-3'],
        date: '2025-01-14T09:18:00.000+00:00',
        dateSigned: '2025-01-14T09:29:26+00:00',
        writtenBy: 'MARCI P MCGUIRE',
        signedBy: 'MARCI P MCGUIRE',
        admissionDate: null,
        dischargeDate: null,
        location: 'CHYSHR TEST LAB',
        note: 'VGhpcyBpcyBhIHRlc3QgdGVsZWhlYWx0aCBkaXNjaGFyZ2Ugbm90ZS4NCg==',
        source: 'vista',
      },
    },
    {
      id: '2e1d581e-bb36-4041-9350-40dbb5651d5c',
      type: 'clinical_note',
      attributes: {
        id: '2e1d581e-bb36-4041-9350-40dbb5651d5c',
        name: 'UROLOGY PROGRESS NOTE',
        noteType: 'physician_procedure_note',
        loincCodes: ['11506-3'],
        date: '2024-12-18T05:22:40.000+00:00',
        dateSigned: '2024-12-18T05:25:10+00:00',
        writtenBy: 'MARCI P MCGUIRE',
        signedBy: 'MARCI P MCGUIRE',
        admissionDate: null,
        dischargeDate: null,
        location: 'CHYSHR TEST LAB',
        note:
          'VXJpbmFseXNpcyBwb3NpdGl2ZSBmb3IgUHJvdGV1cyBtaXJhYmlsaXMuIFByZXNjcmliZWQgQXVnbWVudGluIGFuZCBpbnN0cnVjdGVkIA0KTXIuIFNpbHZhIHRvIGRpc2NvbnRpbnVlIHRoZSBvcmlnaW5hbCBSeC4NCg==',
        source: 'vista',
      },
    },
    {
      id: '51b17767-5226-4260-8fd3-7c9acf1675b0',
      type: 'clinical_note',
      attributes: {
        id: '51b17767-5226-4260-8fd3-7c9acf1675b0',
        name: 'AUDIOLOGY TEMPLATE CONSULT REPORT',
        noteType: 'consult_result',
        loincCodes: ['11488-4'],
        date: '2024-12-12T10:21:24.000+00:00',
        dateSigned: '2024-12-12T10:22:32+00:00',
        writtenBy: 'MARCI P MCGUIRE',
        signedBy: 'MARCI P MCGUIRE',
        admissionDate: null,
        dischargeDate: null,
        location: 'CHYSHR TEST LAB',
        note:
          'VGhpcyBpcyBhbiBhZGRlbmR1bSB0byBjb3JyZWN0IHByZXZpb3MgQXVkaW9sb2d5IHJlcG9ydC4gDQo=',
        source: 'vista',
      },
    },
    {
      id: '1c0b0ba5-4ea3-4fac-b6ba-6ba089ac7175',
      type: 'clinical_note',
      attributes: {
        id: '1c0b0ba5-4ea3-4fac-b6ba-6ba089ac7175',
        name: 'C&P UROLOGY',
        noteType: 'physician_procedure_note',
        loincCodes: ['11506-3'],
        date: '2024-12-17T11:07:00.000+00:00',
        dateSigned: '2024-12-17T11:09:35+00:00',
        writtenBy: 'VICTORIA A BORLAND',
        signedBy: 'VICTORIA A BORLAND',
        admissionDate: null,
        dischargeDate: null,
        location: 'CHYSHR TEST LAB',
        note:
          'TGFyZ2UgbnVtYmVycyBvZiBiYWN0ZXJpYSBpbiB1cmluZSBpbmRpY2F0aXZlIG9mIFVUSS4gUHJlc2NyaWJpbmcgTWFjcm9iaWQgDQpwZW5kaW5nIGNvbXBsZXRlIGxhYiByZXN1bHRzLg0K',
        source: 'vista',
      },
    },
    {
      id: '15249697279',
      type: 'clinical_note',
      attributes: {
        id: '15249697279',
        name: 'Clinical Summary',
        noteType: 'discharge_summary',
        loincCodes: ['18842-5'],
        date: '2025-07-29T17:48:51Z',
        dateSigned: null,
        writtenBy: 'Victoria A Borland',
        signedBy: 'Victoria A Borland',
        dischargeDate: '2025-07-29T17:48:41Z',
        admissionDate: '2025-07-29T17:48:41Z',
        location: '668 Mann-Grandstaff WA VA Medical Center',
        note:
          'Q2xpbmljYWwgU3VtbWFyeSAqIEZpbmFsIFJlcG9ydCAqIE5hbWU6U0lMVkEsIEFMRVhBTkRFUiBSSUNBUkRPIEFkZHJlc3M6IDIzNCBURVNUSU5HIEtBTlNBUyBDSVRZLCBNTyA4Nzk0NCBTZXg6TWFsZSBEYXRlIG9mIEJpcnRoOjAzLzAxLzE5OTAgUGhvbmU6KzMzNjU1MjEyMzQgUmFjZTogQmxhY2sgb3IgQWZyaWNhbiBBbWVyaWNhbiBFdGhuaWNpdHk6IE5vdCBIaXNwYW5pYyBvciBMYXRpbm8gTVJOOjgzNjE3OTMyMDAwMDAxIEZJTjoxMjkyNjMxMjkgTG9jYXRpb246NjY4IE1hbm4tR3JhbmRzdGFmZiBXQSBWQSBNZWRpY2FsIENlbnRlciBSZWdpc3RyYXRpb24gRGF0ZSBhbmQgVGltZTowNi8yNi8yMDI1IDA5OjI3IFBEVCBBbGxlcmdpZXMgcGVuaWNpbGxpbnMgKFVydGljYXJpYSAoSGl2ZXMpLCBTbmVlemluZykgRm9sbG93IFVwIEluc3RydWN0aW9ucyBObyBxdWFsaWZ5aW5nIGRhdGEgYXZhaWxhYmxlIFByb2JsZW1zIE9uZ29pbmcgRGlzZWFzZSBjYXVzZWQgYnkgMjAxOSBub3ZlbCBjb3JvbmF2aXJ1cyBIaXN0b3JpY2FsIE5vIHF1YWxpZnlpbmcgZGF0YSBQcm9jZWR1cmVzIE5vIHByb2NlZHVyZSBoaXN0b3J5IGRvY3VtZW50ZWQgU29jaWFsIEhpc3RvcnkgTm8gc29jaWFsIGhpc3RvcnkgZG9jdW1lbnRlZCBTaWduYXR1cmUgTGluZSBFbGVjdHJvbmljYWxseSBzaWduZWQgb246IDA3LzI5LzIwMjUgMTI6NDggQ0RUIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18gVmljdG9yaWEgQSBCb3JsYW5kIFJlc3VsdCB0eXBlOiBJbnBhdGllbnQgQ2xpbmljYWwgU3VtbWFyeSBSZXN1bHQgZGF0ZTogSnVseSAyOSwgMjAyNSAxNzo0OCBVVEMgUmVzdWx0IHN0YXR1czogQXV0aCAoVmVyaWZpZWQpIFJlc3VsdCB0aXRsZTogQ2xpbmljYWwgU3VtbWFyeSBQZXJmb3JtZWQgYnk6IEJvcmxhbmQsIFZpY3RvcmlhIEEgb24gSnVseSAyOSwgMjAyNSAxMjo0OCBDRFQgVmVyaWZpZWQgYnk6IEJvcmxhbmQsIFZpY3RvcmlhIEEgb24gSnVseSAyOSwgMjAyNSAxMjo0OCBDRFQgRW5jb3VudGVyIGluZm86IDEyOTI2MzEyOSwgNjY4IFNQTyBXQSBWQSwgQmV0d2VlbiBWaXNpdCwgNi8yNi8yMDI1IC0=',
        source: 'oracle-health',
      },
    },
    {
      id: '15249651570',
      type: 'clinical_note',
      attributes: {
        id: '15249651570',
        name: 'Inpatient Discharge Instructions - VA',
        noteType: 'other',
        loincCodes: ['96339-7'],
        date: '2025-07-29T17:47:50Z',
        dateSigned: null,
        writtenBy: 'Victoria A Borland',
        signedBy: 'Victoria A Borland',
        admissionDate: null,
        dischargeDate: '2025-07-29T17:47:25Z',
        location: '668 Mann-Grandstaff WA VA Medical Center',
        note:
          'SW5wYXRpZW50IERpc2NoYXJnZSBJbnN0cnVjdGlvbnMgLSBWQSAqIEZpbmFsIFJlcG9ydCAqIERpc2NoYXJnZSBJbnN0cnVjdGlvbnMgV2hhdCB0byBkbyBuZXh0IEluc3RydWN0aW9ucyBGcm9tIFlvdXIgUHJvdmlkZXIgRG9uJ3QgZGllIEFkZGl0aW9uYWwgRm9sbG93IFVwIEluc3RydWN0aW9ucyBObyBxdWFsaWZ5aW5nIGRhdGEgYXZhaWxhYmxlIFZBIEJlbmVmaWNpYXJ5IE5lZWRpbmcgSGVscCBBY2Nlc3MgeW91ciB2ZXRlcmFucyBiZW5lZml0cyBhbmQgbWFuYWdlIHlvdXIgaGVhbHRoY2FyZSBhdCB2YS5nb3YgTmF0aW9uYWwgU3VpY2lkZSBQcmV2ZW50aW9uIExpZmUgTGluZSAyNC83IGFzc2lzdGFuY2U6IDk4OCwgdGhlbiBwcmVzcyAxLCBvciBvbmxpbmUgYXQgVmV0ZXJhbnNDcmlzaXNMaW5lLm5ldCAtIFRoaW5raW5nIGFib3V0IGh1cnRpbmcgb3Iga2lsbGluZyB5b3Vyc2VsZiAtIExvb2tpbmcgZm9yIHdheXMgdG8ga2lsbCB5b3Vyc2VsZiAtIFRhbGtpbmcgYWJvdXQgZGVhdGgsIGR5aW5nLCBvciBzdWljaWRlIC0gU2VsZi1kZXN0cnVjdGl2ZSBiZWhhdmlvciBzdWNoIGFzIGRydWcgYWJ1c2UsIHdlYXBvbnMsIGV0YyBGb3IgaW5mb3JtYXRpb24gb24gd2hlcmUgdG8gcmVjZWl2ZSBhIHZhY2NpbmF0aW9uLCBwbGVhc2UgZWl0aGVyIHJlYWNoIG91dCB0byB5b3VyIHByaW1hcnkgY2FyZSBwaHlzaWNpYW4ncyBvZmZpY2Ugb3IgdmlzaXQgdmFjY2luZXMuZ292LiBJbmZvcm1hdGlvbiBmcm9tIHlvdXIgdmlzaXQgVGhpcyBJcyBZb3VyIE1lZGljYXRpb25zIExpc3QgTm8gRGF0YSBBdmFpbGFibGUgUHJvY2VkdXJlcyBQZXJmb3JtZWQgTm8gcHJvY2VkdXJlcyBwZXJmb3JtZWQgZHVyaW5nIHRoaXMgdmlzaXQgVGVzdCBSZXN1bHRzIE5vIHF1YWxpZnlpbmcgZGF0YSBhdmFpbGFibGUuIEFsbGVyZ2llcyBwZW5pY2lsbGlucyAoVXJ0aWNhcmlhIChIaXZlcyksIFNuZWV6aW5nKSBQcm9ibGVtcyBPbmdvaW5nIC0gQW55IHByb2JsZW0gdGhhdCB5b3UgYXJlIGN1cnJlbnRseSByZWNlaXZpbmcgdHJlYXRtZW50IGZvci4gRGlzZWFzZSBjYXVzZWQgYnkgMjAxOSBub3ZlbCBjb3JvbmF2aXJ1cyBDb21tb24gRW1lcmdlbmN5IEF3YXJlbmVzcyBUaXBzIElTIElUIEEgU1RST0tFPyBBY3QgRkFTVCBhbmQgQ2hlY2sgZm9yIHRoZXNlIHNpZ25zOiBGQUNFIERvZXMgdGhlIGZhY2UgbG9vayB1bmV2ZW4/IEFSTSBEb2VzIG9uZSBhcm0gZHJpZnQgZG93bj8gU1BFRUNIIERvZXMgdGhlaXIgc3BlZWNoIHNvdW5kIHN0cmFuZ2U/IFRJTUUgQ2FsbCA5LTEtMSBhdCBhbnkgc2lnbiBvZiBzdHJva2UgSGVhcnQgQXR0YWNrIFNpZ25zIENoZXN0IGRpc2NvbWZvcnQ6IE1vc3QgaGVhcnQgYXR0YWNrcyBpbnZvbHZlIGRpc2NvbWZvcnQgaW4gdGhlIGNlbnRlciBvZiB0aGUgY2hlc3QgYW5kIGxhc3RzIG1vcmUgdGhhbiBhIGZldyBtaW51dGVzLCBvciBnb2VzIGF3YXkgYW5kIGNvbWVzIGJhY2suIEl0IGNhbiBmZWVsIGxpa2UgdW5jb21mb3J0YWJsZSBwcmVzc3VyZSwgc3F1ZWV6aW5nLCBmdWxsbmVzcyBvciBwYWluLiBEaXNjb21mb3J0IGluIHVwcGVyIGJvZHk6IFN5bXB0b21zIGNhbiBpbmNsdWRlIHBhaW4gb3IgZGlzY29tZm9ydCBpbiBvbmUgb3IgYm90aCBhcm1zLCBiYWNrLCBuZWNrLCBqYXcgb3Igc3RvbWFjaC4gU2hvcnRuZXNzIG9mIGJyZWF0aDogV2l0aCBvciB3aXRob3V0IGRpc2NvbWZvcnQuIE90aGVyIHNpZ25zOiBCcmVha2luZyBvdXQgaW4gYSBjb2xkIHN3ZWF0LCBuYXVzZWEsIG9yIGxpZ2h0aGVhZGVkLiBSZW1lbWJlciwgTUlOVVRFUyBETyBNQVRURVIuIElmIHlvdSBleHBlcmllbmNlIGFueSBvZiB0aGVzZSBoZWFydCBhdHRhY2sgd2FybmluZyBzaWducywgY2FsbCA5LTEtMSB0byBnZXQgaW1tZWRpYXRlIG1lZGljYWwgYXR0ZW50aW9uISBSZXN1bHQgdHlwZTogSW5wYXRpZW50IFBhdGllbnQgU3VtbWFyeSBSZXN1bHQgZGF0ZTogSnVseSAyOSwgMjAyNSAxNzo0NyBVVEMgUmVzdWx0IHN0YXR1czogQXV0aCAoVmVyaWZpZWQpIFJlc3VsdCB0aXRsZTogSW5wYXRpZW50IERpc2NoYXJnZSBJbnN0cnVjdGlvbnMgLSBWQSBQZXJmb3JtZWQgYnk6IEJvcmxhbmQsIFZpY3RvcmlhIEEgb24gSnVseSAyOSwgMjAyNSAxMjo0NyBDRFQgVmVyaWZpZWQgYnk6IEJvcmxhbmQsIFZpY3RvcmlhIEEgb24gSnVseSAyOSwgMjAyNSAxMjo0NyBDRFQgRW5jb3VudGVyIGluZm86IDEyOTI2MzEyOSwgNjY4IFNQTyBXQSBWQSwgQmV0d2VlbiBWaXNpdCwgNi8yNi8yMDI1IC0=',
        source: 'oracle-health',
      },
    },
  ],
};

const empty = { data: [] };

const single = (req, res) => {
  const { id } = req.params;
  const response = all.data.find(item => item.id === id);
  return res.json({ data: response });
};

module.exports = {
  all,
  single,
  empty,
};
