import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
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
import {
  testableApiRequestWithRetry,
  getAllergies,
  getAllergy,
  getCondition,
  getConditions,
  getLabOrTest,
  getLabsAndTests,
  getNote,
  getNotes,
  getVaccine,
  getVaccineList,
  getVitalsList,
  postSharingUpdateStatus,
} from '../../api/MrApi';

describe('apiRequestWithRetry', () => {
  let callCount = 0;

  const mockedApiRequest = async () => {
    // Return a 202 ACCEPTED response twice, then return success on the third try.
    callCount += 1;
    if (callCount < 3) {
      return { status: 202 };
    }
    return 'success';
  };

  beforeEach(() => {
    callCount = 0;
  });

  it('times out if success is not returned quickly enough', async () => {
    try {
      const endTime = Date.now() + 100;
      await testableApiRequestWithRetry(200, mockedApiRequest)(
        'http://example.com/api',
        {},
        endTime,
      );
      expect.fail('Function should have thrown an error due to timeout');
    } catch (error) {
      expect(error).to.exist;
      expect(callCount).to.be.lessThan(3);
    }
  });

  it('retries several times before returning successfully', async () => {
    try {
      const endTime = Date.now() + 500;
      const result = await testableApiRequestWithRetry(200, mockedApiRequest)(
        'http://example.com/api',
        {},
        endTime,
      );
      expect(result).to.equal('success');
      expect(callCount).to.equal(3);
    } catch (error) {
      expect.fail('Function should not have thrown an error');
    }
  });
});

describe('Get labs and tests api call', () => {
  it('should make an api call to get all labs and tests', () => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);

    return getLabsAndTests(true).then(res => {
      expect(res.entry.length).to.equal(13);
    });
  });
});

describe('Get labs and tests details api call', () => {
  it('should make an api call to get a single lab or test', () => {
    const mockData = pathology;
    mockApiRequest(mockData);

    return getLabOrTest('123', true).then(res => {
      expect(res.resourceType).to.equal('DiagnosticReport');
    });
  });
});

describe('Get notes api call', () => {
  it('should make an api call to get all notes', () => {
    const mockData = notes;
    mockApiRequest(mockData);

    return getNotes(true).then(res => {
      expect(res.entry.length).to.equal(4);
    });
  });
});

describe('Get note details api call', () => {
  it('should make an api call to get a single note', () => {
    const mockData = note;
    mockApiRequest(mockData);

    return getNote('123', true).then(res => {
      expect(res.resourceType).to.equal('DocumentReference');
    });
  });
});

describe('Get vitals api call', () => {
  it('should make an api call to get all vitals', () => {
    const mockData = vitals;
    mockApiRequest(mockData);

    return getVitalsList(true).then(res => {
      expect(res.entry.length).to.equal(40);
    });
  });
});

describe('Get health conditions api call', () => {
  it('should make an api call to get all health conditions', () => {
    const mockData = conditions;
    mockApiRequest(mockData);

    return getConditions(true).then(res => {
      expect(res.length).to.equal(4);
    });
  });
});

describe('Get health condition details api call', () => {
  it('should make an api call to get a single health condition', () => {
    const mockData = condition;
    mockApiRequest(mockData);

    return getCondition('123', true).then(res => {
      expect(res.name).to.equal('Back pain (SCT 161891005)');
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

    return getVaccineList(true).then(res => {
      expect(res.entry.length).to.equal(5);
    });
  });
});

describe('Get vaccine details api call', () => {
  it('should make an api call to get a single vaccine', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);

    return getVaccine('123', true).then(res => {
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
