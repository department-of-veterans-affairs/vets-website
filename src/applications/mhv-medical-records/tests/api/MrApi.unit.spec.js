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
import radiologyListMhv from '../fixtures/radiologyRecordsMhv.json';
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

describe('Get radiology detais from MHV api call', () => {
  beforeEach(() => {
    // Create a simple hash function for the mock (non-cryptographic)
    const simpleHash = data => {
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        hash = Math.imul(31, hash) + data[i]; // Use Math.imul for safe 32-bit multiplication
        hash = Math.abs(hash % 2 ** 32); // Ensure hash stays within 32-bit bounds
      }
      // Convert hash to Uint8Array
      const buffer = new Uint8Array([
        hash % 256,
        Math.floor(hash / 256) % 256,
        Math.floor(hash / 65536) % 256,
        Math.floor(hash / 16777216) % 256,
      ]);
      return buffer.buffer;
    };

    // Mock the global crypto.subtle.digest function
    global.crypto = {
      subtle: {
        digest: (algorithm, data) => {
          // Simulate digest based on the input data
          return Promise.resolve(simpleHash(new Uint8Array(data)));
        },
      },
    };
  });

  it('should make an api call to get MHV radiology tests and pick based on ID', () => {
    const mockData = radiologyListMhv;
    mockApiRequest(mockData);

    return getMhvRadiologyDetails('r5621491-aaa').then(res => {
      expect(res.phrDetails.eventDate).to.equal('2001-02-16T18:16:00Z');
    });
  });

  it('should make an api call to get MHV radiology tests and pick based on hash', () => {
    const mockData = radiologyListMhv;
    mockApiRequest(mockData);

    return getMhvRadiologyDetails('r12345-f8f80533').then(res => {
      expect(res.phrDetails.eventDate).to.equal('2001-02-16T18:16:00Z');
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
