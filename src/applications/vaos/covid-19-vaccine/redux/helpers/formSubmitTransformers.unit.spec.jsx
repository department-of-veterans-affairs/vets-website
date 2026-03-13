import { expect } from 'chai';
import sinon from 'sinon';
import * as locationModule from '../../../services/location';
import * as selectors from '../../../redux/selectors';
import { transformFormToVAOSAppointment } from './formSubmitTransformers';

describe('COVID-19 Vaccine data transformation', () => {
  let isCernerLocationStub;
  let selectRegisteredCernerFacilityIdsStub;

  beforeEach(() => {
    isCernerLocationStub = sinon.stub(locationModule, 'isCernerLocation');
    selectRegisteredCernerFacilityIdsStub = sinon.stub(
      selectors,
      'selectRegisteredCernerFacilityIds',
    );
  });

  afterEach(() => {
    isCernerLocationStub.restore();
    selectRegisteredCernerFacilityIdsStub.restore();
  });

  const baseState = {
    covid19Vaccine: {
      newBooking: {
        data: {
          vaFacility: '983',
          clinicId: '983_308',
          date1: ['2024-01-15T09:30:00Z'],
        },
        clinics: {
          '983': [
            {
              id: '983_308',
              serviceName: 'Green Team Clinic1',
              stationId: '983',
            },
          ],
        },
        availableSlots: [
          {
            id: 'slot-1',
            start: '2024-01-15T09:30:00Z',
            end: '2024-01-15T10:00:00Z',
          },
        ],
      },
    },
  };

  describe('transformFormToVAOSAppointment', () => {
    it('should include systemType as vista for VistA facility', () => {
      selectRegisteredCernerFacilityIdsStub.returns([]);
      isCernerLocationStub.returns(false);

      const result = transformFormToVAOSAppointment(baseState);

      expect(result.systemType).to.equal('vista');
      expect(result).to.deep.include({
        kind: 'clinic',
        status: 'booked',
        locationId: '983',
      });
    });

    it('should include systemType as cerner for Cerner facility', () => {
      selectRegisteredCernerFacilityIdsStub.returns(['757']);
      isCernerLocationStub.returns(true);

      const state = {
        covid19Vaccine: {
          newBooking: {
            data: {
              vaFacility: '757',
              clinicId: '757_100',
              date1: ['2024-01-15T09:30:00Z'],
            },
            clinics: {
              '757': [
                {
                  id: '757_100',
                  serviceName: 'Cerner Clinic',
                  stationId: '757',
                },
              ],
            },
            availableSlots: [
              {
                id: 'slot-1',
                start: '2024-01-15T09:30:00Z',
                end: '2024-01-15T10:00:00Z',
              },
            ],
          },
        },
      };

      const result = transformFormToVAOSAppointment(state);

      expect(result.systemType).to.equal('cerner');
      expect(result).to.deep.include({
        kind: 'clinic',
        status: 'booked',
        locationId: '757',
      });
    });

    it('should return correct appointment structure with slot info', () => {
      selectRegisteredCernerFacilityIdsStub.returns([]);
      isCernerLocationStub.returns(false);

      const result = transformFormToVAOSAppointment(baseState);

      expect(result).to.have.property('kind', 'clinic');
      expect(result).to.have.property('status', 'booked');
      expect(result).to.have.property('systemType', 'vista');
      expect(result).to.have.property('locationId', '983');
      expect(result.slot).to.deep.equal({ id: 'slot-1' });
      expect(result.extension).to.deep.equal({
        desiredDate: '2024-01-15T09:30:00Z',
      });
    });
  });
});
