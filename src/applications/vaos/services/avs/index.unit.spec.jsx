import { expect } from 'chai';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { fetchAvsPdfBinaries } from '.';

describe('VAOS Services: AVS', () => {
  describe('fetchAvsPdfBinaries', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should fetch AVS PDF binaries and merge with metadata', async () => {
      const appointmentId = 'AVS_PDF_Test_1';
      const avsPdfArray = [
        {
          id: '208750417891',
          apptId: 'AVS_PDF_Test_1',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
        },
        {
          id: '208750417892',
          apptId: 'AVS_PDF_Test_1',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: '208750417891',
            attributes: {
              docId: '208750417891',
              binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
            },
          },
          {
            id: '208750417892',
            attributes: {
              docId: '208750417892',
              binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
            },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      // Verify the API call was made correctly
      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/appointments/avs_binary/${appointmentId}`,
      );
      expect(global.fetch.firstCall.args[0]).to.contain(
        'doc_ids=208750417891,208750417892',
      );

      // Verify the result merges metadata with fetched binaries
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.deep.include({
        id: '208750417891',
        apptId: 'AVS_PDF_Test_1',
        name: 'Ambulatory Visit Summary',
        noteType: 'ambulatory_patient_summary',
        contentType: 'application/pdf',
        binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
        error: null,
      });
      expect(result[0].loincCodes).to.deep.equal(['4189669', '96345-4']);
      expect(result[1]).to.deep.include({
        id: '208750417892',
        binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
        error: null,
      });
    });

    it('should handle single AVS PDF', async () => {
      const appointmentId = 'AVS_PDF_Test_2';
      const avsPdfArray = [
        {
          id: '208750417893',
          apptId: 'AVS_PDF_Test_2',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: '208750417893',
            attributes: {
              docId: '208750417893',
              error: 'Retrieved empty AVS binary',
            },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      expect(global.fetch.firstCall.args[0]).to.contain('doc_ids=208750417893');
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.deep.include({
        id: '208750417893',
        binary: null,
        error: 'Retrieved empty AVS binary',
      });
    });

    it('should handle mixed success and error responses', async () => {
      const appointmentId = 'AVS_PDF_Test_5';
      const avsPdfArray = [
        {
          id: '208750417896',
          apptId: 'AVS_PDF_Test_5',
          name: 'Pharmacology Discharge summary',
          noteType: 'pharmacology_discharge_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
        },
        {
          id: '208750417897',
          apptId: 'AVS_PDF_Test_5',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: '208750417896',
            attributes: {
              docId: '208750417896',
              binary: 'JVBERi0xLjQKJeLjz9M#INVALID-DATA$$%%123==',
            },
          },
          {
            id: '208750417897',
            attributes: {
              docId: '208750417897',
              binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
            },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      expect(result).to.have.lengthOf(2);
      expect(result[0].binary).to.equal(
        'JVBERi0xLjQKJeLjz9M#INVALID-DATA$$%%123==',
      );
      expect(result[0].error).to.be.null;
      expect(result[1].binary).to.equal(
        'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
      );
      expect(result[1].error).to.be.null;
    });

    it('should handle retrieval errors', async () => {
      const appointmentId = 'AVS_PDF_Test_6';
      const avsPdfArray = [
        {
          id: '208750417898',
          apptId: 'AVS_PDF_Test_6',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: '208750417898',
            attributes: {
              docId: '208750417898',
              error: 'Error retrieving AVS binary',
            },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.deep.include({
        id: '208750417898',
        binary: null,
        error: 'Error retrieving AVS binary',
      });
    });

    it('should preserve all metadata fields when merging', async () => {
      const appointmentId = 'AVS_PDF_Test_7';
      const avsPdfArray = [
        {
          id: '208750417899',
          apptId: 'AVS_PDF_Test_7',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
          customField: 'custom-value',
        },
        {
          id: '208750417900',
          apptId: 'AVS_PDF_Test_7',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          loincCodes: ['4189669', '96345-4'],
          contentType: 'application/pdf',
          anotherField: 'another-value',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: '208750417899',
            attributes: {
              docId: '208750417899',
              error: 'Error retrieving AVS binary',
            },
          },
          {
            id: '208750417900',
            attributes: {
              docId: '208750417900',
              binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
            },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      expect(result).to.have.lengthOf(2);

      // Verify first item preserves custom fields and adds error
      expect(result[0]).to.deep.include({
        id: '208750417899',
        customField: 'custom-value',
        binary: null,
        error: 'Error retrieving AVS binary',
      });

      // Verify second item preserves custom fields and adds binary
      expect(result[1]).to.deep.include({
        id: '208750417900',
        anotherField: 'another-value',
        binary: 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9n',
        error: null,
      });
    });

    it('should handle empty avsPdfArray', async () => {
      const appointmentId = 'AVS_PDF_Test_Empty';
      const avsPdfArray = [];

      const mockResponse = {
        data: [],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      expect(global.fetch.firstCall.args[0]).to.contain('doc_ids=');
      expect(result).to.have.lengthOf(0);
    });

    it('should construct correct URL with query parameters', async () => {
      const appointmentId = 'TEST_APPT_123';
      const avsPdfArray = [
        { id: 'DOC_001' },
        { id: 'DOC_002' },
        { id: 'DOC_003' },
      ];

      const mockResponse = {
        data: [
          {
            id: 'DOC_001',
            attributes: { docId: 'DOC_001', binary: 'pdf1' },
          },
          {
            id: 'DOC_002',
            attributes: { docId: 'DOC_002', binary: 'pdf2' },
          },
          {
            id: 'DOC_003',
            attributes: { docId: 'DOC_003', binary: 'pdf3' },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      const fetchUrl = global.fetch.firstCall.args[0];
      expect(fetchUrl).to.contain(
        '/vaos/v2/appointments/avs_binary/TEST_APPT_123',
      );
      expect(fetchUrl).to.contain('doc_ids=DOC_001,DOC_002,DOC_003');
    });

    it('should set binary and error to null when not present in response', async () => {
      const appointmentId = 'AVS_PDF_Test_Null';
      const avsPdfArray = [
        {
          id: '208750417999',
          name: 'Test PDF',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: '208750417999',
            attributes: {
              docId: '208750417999',
              // No binary or error field
            },
          },
        ],
      };

      setFetchJSONResponse(global.fetch, mockResponse);

      const result = await fetchAvsPdfBinaries(appointmentId, avsPdfArray);

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.deep.include({
        id: '208750417999',
        name: 'Test PDF',
        binary: null,
        error: null,
      });
    });

    it('should handle API errors', async () => {
      const appointmentId = 'AVS_PDF_Test_Error';
      const avsPdfArray = [
        {
          id: '208750417999',
          name: 'Test PDF',
        },
      ];

      global.fetch.rejects(new Error('Network error'));

      try {
        await fetchAvsPdfBinaries(appointmentId, avsPdfArray);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Network error');
      }
    });
  });
});
