import { expect } from 'chai';

import { setVeteranData, SET_VETERAN_DATA } from './index';

describe('pre-check-in', () => {
  describe('actions', () => {
    describe('setVeteranData', () => {
      it('should return correct action', () => {
        const action = setVeteranData({});
        expect(action.type).to.equal(SET_VETERAN_DATA);
      });
      it('should return correct structure', () => {
        const action = setVeteranData({
          appointments: [
            { appointmentIen: 'abc-123' },
            {
              appointmentIen: 'def-456',
            },
          ],
          demographics: { lastName: 'Smith' },
        });
        expect(action.payload.appointments).to.be.an('array');
        expect(action.payload.appointments).to.deep.equal([
          { appointmentIen: 'abc-123' },
          { appointmentIen: 'def-456' },
        ]);

        expect(action.payload.demographics).to.be.an('object');
        expect(action.payload.demographics).to.deep.equal({
          lastName: 'Smith',
        });
      });
    });
  });
});
