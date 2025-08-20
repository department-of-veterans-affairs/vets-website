const all = [
  {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    attributes: {
      loincCodes: ['18842-5'],
      name: 'Discharge Summary',
      date: '2019-03-12T16:30:00Z',
      dateSigned: '2023-10-02T12:00:00Z',
      writtenBy: 'Dr. Jane Doe',
      signedBy: 'Dr. John Smith',
      location: 'VA Medical Center',
      note:
        'TE9DQUwgVElUTEU6IEhUIE1PTlRITFkgTU9OSVRPUiBOT1RFDQpTVEFOREFSRCBUSVRMRTogQ0FSRSBDT09SRElOQVRJT04gSE9NRSBURUxFSEVBTFRIIFNVTU1BUklaQVRJT04NCkRBVEUgT0YgTk9URTogREVDIDI4LCAyMDIzQDA2OjU4IEVOVFJZIERBVEU6IERFQyAyOCwgMjAyM0AwNjo1ODozOA0KQVVUSE9SOiBBTkRSRSBZT1VORyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KVGhlIFZldGVyYW4gaXMgZW5yb2xsZWQgaW4gdGhlIEhvbWUgVGVsZWhlYWx0aCAoSFQpIHByb2dyYW0gYW5kIGNvbnRpbnVlcyB0byBiZSBtb25pdG9yZWQgdmlhIEhUIHRlY2hub2xvZ3kuIFRoZSBkYXRhIHNlbnQgYnkgdGhlIFZldGVyYW4gaXMgcmV2aWV3ZWQgYW5kIGFuYWx5emVkIGJ5IHRoZSBIVCBzdGFmZiwgd2hvIHByb3ZpZGUgb25nb2luZyBjYXNlIG1hbmFnZW1lbnQgYW5kIFZldGVyYW4gaGVhbHRoIGVkdWNhdGlvbiB3aGlsZSBjb21tdW5pY2F0aW5nIGFuZCBjb2xsYWJvcmF0aW5nIHdpdGggdGhlIGhlYWx0aCBjYXJlIHRlYW0gYXMgYXBwcm9wcmlhdGUuIFRoaXMgbm90ZSBjb3ZlcnMgYSB0b3RhbCBvZiAzMCBtaW51dGVzIGZvciB0aGUgbW9udGggbW9uaXRvcmVkLg0KTW9udGggbW9uaXRvcmVkOiBEZWNlbWJlciAyMDIzDQovZXMvIEFORFJFIFlPVU5HDQpNU04sIFJOIEhvbWUgVGVsZWhlYWx0aCBDYXJlIENvb3JkaW5hdG9yDQpTaWduZWQ6IDEyLzI4LzIwMjMgMDY6NTk',
      admissionDate: '2023-09-25T00:00:00Z',
      dischargeDate: '2023-10-01T00:00:00Z',
      summary:
        'Patient was admitted for observation and discharged after 6 days. No complications were noted during the stay.',
    },
  },
  {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    attributes: {
      loincCodes: ['11488-4'],
      name: ' Consult Result',
      date: '2019-03-12T16:30:00Z',
      dateSigned: '2023-10-02T12:00:00Z',
      writtenBy: 'Dr. Jane Doe',
      signedBy: 'Dr. John Smith',
      location: 'VA Medical Center',
      note:
        'TE9DQUwgVElUTEU6IEhUIE1PTlRITFkgTU9OSVRPUiBOT1RFDQpTVEFOREFSRCBUSVRMRTogQ0FSRSBDT09SRElOQVRJT04gSE9NRSBURUxFSEVBTFRIIFNVTU1BUklaQVRJT04NCkRBVEUgT0YgTk9URTogREVDIDI4LCAyMDIzQDA2OjU4IEVOVFJZIERBVEU6IERFQyAyOCwgMjAyM0AwNjo1ODozOA0KQVVUSE9SOiBBTkRSRSBZT1VORyBFWFAgQ09TSUdORVI6DQpVUkdFTkNZOiBTVEFUVVM6IENPTVBMRVRFRA0KVGhlIFZldGVyYW4gaXMgZW5yb2xsZWQgaW4gdGhlIEhvbWUgVGVsZWhlYWx0aCAoSFQpIHByb2dyYW0gYW5kIGNvbnRpbnVlcyB0byBiZSBtb25pdG9yZWQgdmlhIEhUIHRlY2hub2xvZ3kuIFRoZSBkYXRhIHNlbnQgYnkgdGhlIFZldGVyYW4gaXMgcmV2aWV3ZWQgYW5kIGFuYWx5emVkIGJ5IHRoZSBIVCBzdGFmZiwgd2hvIHByb3ZpZGUgb25nb2luZyBjYXNlIG1hbmFnZW1lbnQgYW5kIFZldGVyYW4gaGVhbHRoIGVkdWNhdGlvbiB3aGlsZSBjb21tdW5pY2F0aW5nIGFuZCBjb2xsYWJvcmF0aW5nIHdpdGggdGhlIGhlYWx0aCBjYXJlIHRlYW0gYXMgYXBwcm9wcmlhdGUuIFRoaXMgbm90ZSBjb3ZlcnMgYSB0b3RhbCBvZiAzMCBtaW51dGVzIGZvciB0aGUgbW9udGggbW9uaXRvcmVkLg0KTW9udGggbW9uaXRvcmVkOiBEZWNlbWJlciAyMDIzDQovZXMvIEFORFJFIFlPVU5HDQpNU04sIFJOIEhvbWUgVGVsZWhlYWx0aCBDYXJlIENvb3JkaW5hdG9yDQpTaWduZWQ6IDEyLzI4LzIwMjMgMDY6NTk',
      admissionDate: '2023-09-25T00:00:00Z',
      dischargeDate: '2023-10-01T00:00:00Z',
      summary:
        'Patient was admitted for observation and discharged after 6 days. No complications were noted during the stay.',
    },
  },
];
const empty = [];
const single = id => {
  const sampleData = all.find(item => item.id === id);
  if (!sampleData) {
    return null;
  }
  return {
    data: sampleData,
  };
};

module.exports = {
  all,
  empty,
  single,
};
