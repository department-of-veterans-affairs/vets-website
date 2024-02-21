import { expect } from 'chai';

import { selectTypeOfCareName } from '../selectors';

describe('appointment-list / redux / selectors', () => {
  it('should return COMPENSATION & PENSION as type of care', () => {
    const appointment = {
      vaos: {
        apiData: {
          serviceType: 'audiology',
          serviceCategory: [
            {
              coding: [
                {
                  system:
                    'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
                  code: 'COMPENSATION & PENSION',
                  display: 'COMPENSATION & PENSION',
                },
              ],
              text: 'COMPENSATION & PENSION',
            },
          ],
        },
      },
    };
    const typeOfCareName = selectTypeOfCareName(appointment);
    expect(typeOfCareName).to.equal('Claim exam');
  });
  it('should return Audiology and speech as type of care', () => {
    const appointment = {
      vaos: {
        apiData: {
          serviceType: 'audiology',
          serviceCategory: [
            {
              coding: [
                {
                  system:
                    'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
                  code: 'REGULAR',
                  display: 'REGULAR',
                },
              ],
              text: 'REGULAR',
            },
          ],
        },
      },
    };
    const typeOfCareName = selectTypeOfCareName(appointment);
    expect(typeOfCareName).to.equal('Audiology and speech');
  });
});
