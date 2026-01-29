import fs from 'fs';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import Sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { edipiNotFound } from '@department-of-veterans-affairs/mhv/exports';
import { buildInitialDateRange } from '../../util/helpers';
import { DEFAULT_DATE_RANGE } from '../../util/constants';
import labsAndTests from '../fixtures/labsAndTests.json';
import pathology from '../fixtures/pathology.json';
import notes from '../fixtures/notes.json';
import note from '../fixtures/dischargeSummary.json';
import vitals from '../fixtures/vitals.json';
import conditions from '../fixtures/conditions.json';
import condition from '../fixtures/condition.json';
import allergies from '../fixtures/allergies.json';
import allergy from '../fixtures/allergy.json';
import vaccines from '../fixtures/vaccines.json';
import vaccine from '../fixtures/vaccine.json';
import radiologyListMhv from '../fixtures/radiologyRecordsMhv.json';
import medications from '../fixtures/blueButton/medications.json';
import appointments from '../fixtures/blueButton/appointments.json';
import demographicInfo from '../fixtures/blueButton/demographics.json';
import patient from '../fixtures/blueButton/patient.json';

const militaryService = fs.readFileSync(
  'src/applications/mhv-demo-mode/demo-apps/mhv-medical-records/tests/fixtures/blueButton/military-service.txt',
  'utf8',
);

import {
  getAllergies,
  getAllergy,
  getCondition,
  getConditions,
  getLabOrTest,
  getLabsAndTests,
  getMhvRadiologyTests,
  getMhvRadiologyDetails,
  getNote,
  getNotes,
  getVaccine,
  getVaccineList,
  getVitalsList,
  postSharingUpdateStatus,
  getMedications,
  getAppointments,
  getDemographicInfo,
  getMilitaryService,
  getPatient,
  getAcceleratedAllergies,
  getAcceleratedAllergy,
  getVitalsWithOHData,
  getAcceleratedLabsAndTests,
  getAcceleratedImmunizations,
  getAcceleratedImmunization,
  getAcceleratedConditions,
  getAcceleratedCondition,
  postRecordDatadogAction,
  getAcceleratedNotes,
} from '../../api/MrApi';

describe('Get labs and tests api call', () => {
  it('should make an api call to get all labs and tests', () => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);

    return getLabsAndTests().then(res => {
      expect(res.entry.length).to.equal(13);
    });
  });
});

describe('Get labs and tests details api call', () => {
  it('should make an api call to get a single lab or test', () => {
    const mockData = pathology;
    mockApiRequest(mockData);

    return getLabOrTest('123').then(res => {
      expect(res.resourceType).to.equal('DiagnosticReport');
    });
  });
});

describe('Get radiology tests from MHV api call', () => {
  it('should make an api call to get all radiology tests from MHV', () => {
    const mockData = radiologyListMhv;
    mockApiRequest(mockData);

    return getMhvRadiologyTests().then(res => {
      expect(res.length).to.equal(21);
    });
  });
});

describe('Get radiology details from MHV api call', () => {
  it('should make an api call to get MHV radiology tests and pick based on ID', () => {
    const mockData = radiologyListMhv;
    mockApiRequest(mockData);

    return getMhvRadiologyDetails('r5621491-aaa').then(res => {
      expect(res.phrDetails.eventDate).to.equal('2001-02-16T18:16:00Z');
      expect(res.cvixDetails).to.be.null;
    });
  });

  it('should make an api call to get MHV radiology tests and pick based on hash', () => {
    const mockData = radiologyListMhv;
    mockApiRequest(mockData);

    return getMhvRadiologyDetails('r12345-2a591974').then(res => {
      expect(res.phrDetails.eventDate).to.equal('2001-02-16T18:16:00Z');
      expect(res.cvixDetails).to.be.null;
    });
  });
});

describe('Get notes api call', () => {
  it('should make an api call to get all notes', () => {
    const mockData = notes;
    mockApiRequest(mockData);

    return getNotes(true).then(res => {
      expect(res.entry.length).to.equal(6);
    });
  });
});

describe('Get note details api call', () => {
  it('should make an api call to get a single note', () => {
    const mockData = note;
    mockApiRequest(mockData);

    return getNote('123').then(res => {
      expect(res.resourceType).to.equal('DocumentReference');
    });
  });
});

describe('Get vitals api call', () => {
  it('should make an api call to get all vitals', () => {
    const mockData = vitals;
    mockApiRequest(mockData);

    return getVitalsList().then(res => {
      expect(res.entry.length).to.equal(40);
    });
  });
});

describe('Get health conditions api call', () => {
  it('should make an api call to get all health conditions', () => {
    const mockData = conditions;
    mockApiRequest(mockData);

    return getConditions().then(res => {
      expect(res.entry.length).to.equal(5);
    });
  });
});

describe('Get health condition details api call', () => {
  it('should make an api call to get a single health condition', () => {
    const mockData = condition;
    mockApiRequest(mockData);

    return getCondition('123').then(res => {
      expect(res.resourceType).to.equal('Condition');
    });
  });
});

describe('Get allergies api call', () => {
  it('should make an api call to get all allergies', () => {
    const mockData = allergies;
    mockApiRequest(mockData);

    return getAllergies().then(res => {
      expect(res.entry.length).to.equal(5);
    });
  });
});

describe('Get allergy details api call', () => {
  it('should make an api call to get a single allergy', () => {
    const mockData = allergy;
    mockApiRequest(mockData);

    return getAllergy('123').then(res => {
      expect(res.resourceType).to.equal('AllergyIntolerance');
    });
  });
});

describe('Get vaccines api call', () => {
  it('should make an api call to get all vaccines', () => {
    const mockData = vaccines;
    mockApiRequest(mockData);

    return getVaccineList().then(res => {
      expect(res.entry.length).to.equal(5);
    });
  });
});

describe('Get vaccine details api call', () => {
  it('should make an api call to get a single vaccine', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);

    return getVaccine('123').then(res => {
      expect(res.resourceType).to.equal('Immunization');
    });
  });
});

describe('Update sharing status api call', () => {
  it('should make an api call to update user sharing status', () => {
    const mockData = { status: 200 };
    mockApiRequest(mockData);

    return postSharingUpdateStatus().then(res => {
      expect(res.status).to.equal(200);
    });
  });
});

describe('Get medications api call', () => {
  it('should make an api call to get all medications', () => {
    const mockData = medications;
    mockApiRequest(mockData);

    return getMedications().then(res => {
      expect(res.data.length).to.equal(20);
    });
  });
});

describe('Get appointments api call', () => {
  it('should make an api call to get all appointments', () => {
    const mockData = appointments;
    mockApiRequest(mockData);

    const fromDate = '2020-01-01T00:00:00Z';
    const toDate = '2020-12-31T23:59:59Z';

    return getAppointments(fromDate, toDate).then(res => {
      expect(res.data.length).to.equal(2);
    });
  });

  it('should call the correct endpoint with provided from and to dates', async () => {
    const fetchStub = Sinon.stub(global, 'fetch');
    const fromDate = '2021-01-01T00:00:00Z';
    const toDate = '2021-12-31T23:59:59Z';

    const mockResponse = new Response(JSON.stringify({ data: [{}, {}] }), {
      status: 200,
      headers: { 'Content-type': 'application/json' },
    });

    fetchStub.resolves(mockResponse);

    const result = await getAppointments(fromDate, toDate);
    expect(fetchStub.calledOnce).to.be.true;

    const statusParams =
      '&statuses[]=booked&statuses[]=arrived&statuses[]=fulfilled&statuses[]=cancelled';
    const expectedUrl = `${
      environment.API_URL
    }/vaos/v2/appointments?_include=facilities,clinics&start=${fromDate}&end=${toDate}${statusParams}`;
    expect(fetchStub.firstCall.args[0]).to.equal(expectedUrl);
    expect(result.data.length).to.equal(2);

    fetchStub.restore();
  });
});

describe('Get demographic info api call', () => {
  it('should make an api call to get demographic information', () => {
    const mockData = demographicInfo;
    mockApiRequest(mockData);

    return getDemographicInfo().then(res => {
      expect(res.content.length).to.equal(1);
    });
  });
});

describe('Get military service info api call', () => {
  it('should make an api call to get military service information', () => {
    const mockData = militaryService;
    mockApiRequest(mockData);

    return getMilitaryService().then(res => {
      expect(res).to.contain('Military Service');
    });
  });

  it('should handle no EDIPI found response gracefully', async () => {
    const fetchStub = Sinon.stub(global, 'fetch');
    fetchStub.callsFake(url => {
      const response = new Response();
      Object.defineProperty(response, 'ok', { value: false });
      Object.defineProperty(response, 'url', { value: url });
      Object.defineProperty(response, 'status', { value: 500 });
      Object.defineProperty(response, 'error', {
        value: 'No EDIPI found for the current user',
      });

      return Promise.reject(response);
    });

    const thing = await getMilitaryService();
    expect(thing).to.equal(edipiNotFound);
  });

  it('should throw and error on failure', () => {
    const fetchStub = Sinon.stub(global, 'fetch');
    fetchStub.callsFake(url => {
      const response = new Response();
      Object.defineProperty(response, 'ok', { value: false });
      Object.defineProperty(response, 'url', { value: url });
      Object.defineProperty(response, 'status', { value: 500 });
      Object.defineProperty(response, 'statusText', { value: 'Server Error' });

      return Promise.reject(response);
    });

    return getMilitaryService().catch(err => {
      expect(err.statusText).to.equal('Server Error');
    });
  });
});

describe('Get patient profile api call', () => {
  it('should make an api call to get patient profile and treatment facilities', () => {
    const mockData = patient;
    mockApiRequest(mockData);

    return getPatient().then(res => {
      expect(res.ipas.length).to.equal(1);
      expect(res.facilities.length).to.equal(20);
    });
  });
});

describe('Accelerated OH API calls', () => {
  // Creating tests that ensure that the getAPI methods return a promise as expected
  describe('getAcceleratedAllergies', () => {
    it('should make an api call to get all allergies', () => {
      const mockData = { data: [{ id: '123', type: 'allergy' }] };
      mockApiRequest(mockData);

      return getAcceleratedAllergies().then(res => {
        expect(res.data.length).to.equal(1);
        expect(res.data[0].id).to.equal('123');
      });
    });
  });
  describe('getAcceleratedAllergy', () => {
    it('should make an api call to get a single allergy', () => {
      const mockData = { data: { id: '123', type: 'allergy' } };
      mockApiRequest(mockData);

      return getAcceleratedAllergy('123').then(res => {
        expect(res.data.id).to.equal('123');
      });
    });
  });
  describe('getVitalsWithOHData', () => {
    it('should make an api call to get all vitals', () => {
      const mockData = { mock: 'data' };
      const mockDate = '2023-01';
      mockApiRequest(mockData);

      return getVitalsWithOHData(mockDate).then(res => {
        expect(res.mock).to.equal('data');
        // expect fetch to be called with the correct date
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v1/medical_records/vitals?use_oh_data_path=1`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
  });
  describe('getAcceleratedLabsAndTests', () => {
    afterEach(() => {
      MockDate.reset();
    });
    it('falls back to default 3-month range when no dates provided', () => {
      MockDate.set(new Date('2024-07-25'));
      const { fromDate, toDate } = buildInitialDateRange(DEFAULT_DATE_RANGE);
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedLabsAndTests().then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/labs_and_tests?start_date=${fromDate}&end_date=${toDate}`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
    it('uses provided start & end dates when both supplied', () => {
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedLabsAndTests({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      }).then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/labs_and_tests?start_date=2023-01-01&end_date=2023-01-31`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
    it('falls back when only startDate provided (ignores single date)', () => {
      MockDate.set(new Date('2024-07-25'));
      const { fromDate, toDate } = buildInitialDateRange(DEFAULT_DATE_RANGE);
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedLabsAndTests({ startDate: '2023-02-01' }).then(
        res => {
          expect(res.mock).to.equal('data');
          const expectedUrl = `${
            environment.API_URL
          }/my_health/v2/medical_records/labs_and_tests?start_date=${fromDate}&end_date=${toDate}`;
          expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
        },
      );
    });
    it('falls back when only endDate provided (ignores single date)', () => {
      MockDate.set(new Date('2024-07-25'));
      const { fromDate, toDate } = buildInitialDateRange(DEFAULT_DATE_RANGE);
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedLabsAndTests({ endDate: '2023-03-15' }).then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/labs_and_tests?start_date=${fromDate}&end_date=${toDate}`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
  });

  describe('getAcceleratedNotes api call', () => {
    afterEach(() => {
      MockDate.reset();
    });
    it('falls back to default 3-month range when no dates provided', () => {
      MockDate.set(new Date('2024-07-25'));
      const { fromDate, toDate } = buildInitialDateRange(DEFAULT_DATE_RANGE);
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedNotes().then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/clinical_notes?start_date=${fromDate}&end_date=${toDate}`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
    it('uses provided start & end dates when both supplied', () => {
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedNotes({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      }).then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/clinical_notes?start_date=2023-01-01&end_date=2023-01-31`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
    it('falls back when only startDate provided (ignores single date)', () => {
      MockDate.set(new Date('2024-07-25'));
      const { fromDate, toDate } = buildInitialDateRange(DEFAULT_DATE_RANGE);
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedNotes({ startDate: '2023-02-01' }).then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/clinical_notes?start_date=${fromDate}&end_date=${toDate}`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
    it('falls back when only endDate provided (ignores single date)', () => {
      MockDate.set(new Date('2024-07-25'));
      const { fromDate, toDate } = buildInitialDateRange(DEFAULT_DATE_RANGE);
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);
      return getAcceleratedNotes({ endDate: '2023-03-15' }).then(res => {
        expect(res.mock).to.equal('data');
        const expectedUrl = `${
          environment.API_URL
        }/my_health/v2/medical_records/clinical_notes?start_date=${fromDate}&end_date=${toDate}`;
        expect(global.fetch.firstCall.args[0]).to.equal(expectedUrl);
      });
    });
  });

  describe('getAcceleratedImmunizations', () => {
    it('should make an api call to get all immunizations', () => {
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);

      return getAcceleratedImmunizations().then(res => {
        expect(res.mock).to.equal('data');
      });
    });
  });
  describe('getAcceleratedImmunization', () => {
    it('should make an api call to get a single immunization', () => {
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);

      return getAcceleratedImmunization('123').then(res => {
        expect(res.mock).to.equal('data');
      });
    });
  });
  describe('getAcceleratedConditions', () => {
    it('should make an api call to get all Conditions', () => {
      const mockData = { mock: 'data' };
      mockApiRequest(mockData);

      return getAcceleratedConditions().then(res => {
        expect(res.mock).to.equal('data');
      });
    });
  });
});
describe('getAcceleratedCondition', () => {
  it('should make an api call to get a single condition', () => {
    const mockData = { mock: 'data' };
    mockApiRequest(mockData);

    return getAcceleratedCondition('123').then(res => {
      expect(res.mock).to.equal('data');
    });
  });
});
describe('postRecordDatadogAction', () => {
  const endpoint = `${environment.API_URL}/v0/datadog_action`;

  it('should make an api call to record datadog action and return the response', () => {
    const mockData = { status: 'ok' };
    mockApiRequest(mockData);

    return postRecordDatadogAction('TestAction', ['tag1', 'tag2']).then(res => {
      expect(res.status).to.equal('ok');
    });
  });

  it('should call the correct endpoint with correct method, headers, and body, including the "mr." prefix', async () => {
    const fetchStub = Sinon.stub(global, 'fetch');
    const mockResponse = new Response(JSON.stringify({ result: 'done' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    fetchStub.resolves(mockResponse);

    const metricName = 'MyMetric';
    const result = await postRecordDatadogAction(metricName, ['foo', 'bar']);

    // ensure we hit the right URL once
    expect(fetchStub.calledOnce, 'fetch was called once').to.be.true;
    const [url, options] = fetchStub.firstCall.args;
    expect(url).to.equal(endpoint);

    // verify it includes the Content-Type we set
    expect(options.headers).to.have.property(
      'Content-Type',
      'application/json',
    );

    // verify body payload
    const parsed = JSON.parse(options.body);
    // explicit check for "mr." prefix
    expect(parsed.metric).to.equal(`mr.${metricName}`);
    expect(parsed.metric.startsWith('mr.')).to.be.true;
    expect(parsed.tags).to.deep.equal(['foo', 'bar']);

    // and that apiRequest returns the parsed JSON
    expect(result.result).to.equal('done');

    fetchStub.restore();
  });
});
