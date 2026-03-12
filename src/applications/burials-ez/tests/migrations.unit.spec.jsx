import { expect } from 'chai';

import migrations from '../migrations';

describe('Burials migrations', () => {
  it('should set url to claimant address if invalid country code', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        claimantAddress: {
          country: 'US',
        },
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal(
      '/claimant-information/mailing-address',
    );
    expect(formData).to.be.an('object');
  });

  it('should set url to contact information if claimantEmail is missing', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        claimantFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
        },
        claimantAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'USA',
          postalCode: '12345',
        },
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal(
      '/claimant-information/contact-information',
    );
    expect(formData).to.be.an('object');
  });

  it('should not change url if claimantEmail is present', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        claimantEmail: 'user@example.com',
        claimantFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
        },
        claimantAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'USA',
          postalCode: '12345',
        },
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/original-url');
    expect(formData).to.be.an('object');
  });
  context('v3 migration', () => {
    it('should update nursingHomeUnpaid location', () => {
      const { formData, metadata } = migrations[2]({
        formData: {
          locationOfDeath: {
            location: 'nursingHomeUnpaid',
            nursingHomeUnpaid: {
              facilityName: 'Facility Name',
              facilityLocation: 'Facility Location',
            },
          },
        },
        metadata: {
          returnUrl: '/original-url',
        },
      });

      expect(metadata.returnUrl).to.equal('/original-url');
      expect(formData.locationOfDeath.location).to.equal('nursingHomeUnpaid');
      expect(formData.nursingHomeUnpaid.facilityName).to.equal('Facility Name');
      expect(formData.nursingHomeUnpaid.facilityLocation).to.equal(
        'Facility Location',
      );
      expect(formData.locationOfDeath.nursingHomeUnpaid).to.be.empty;
    });
    it('should update nursingHomePaid location', () => {
      const { formData, metadata } = migrations[2]({
        formData: {
          locationOfDeath: {
            location: 'nursingHomePaid',
            nursingHomePaid: {
              facilityName: 'Facility Name',
              facilityLocation: 'Facility Location',
            },
          },
        },
        metadata: {
          returnUrl: '/original-url',
        },
      });

      expect(metadata.returnUrl).to.equal('/original-url');
      expect(formData.locationOfDeath.location).to.equal('nursingHomePaid');
      expect(formData.nursingHomePaid.facilityName).to.equal('Facility Name');
      expect(formData.nursingHomePaid.facilityLocation).to.equal(
        'Facility Location',
      );
      expect(formData.locationOfDeath.nursingHomePaid).to.be.empty;
    });
    it('should update vaMedicalCenter location', () => {
      const { formData, metadata } = migrations[2]({
        formData: {
          locationOfDeath: {
            location: 'vaMedicalCenter',
            vaMedicalCenter: {
              facilityName: 'Facility Name',
              facilityLocation: 'Facility Location',
            },
          },
        },
        metadata: {
          returnUrl: '/original-url',
        },
      });

      expect(metadata.returnUrl).to.equal('/original-url');
      expect(formData.locationOfDeath.location).to.equal('vaMedicalCenter');
      expect(formData.vaMedicalCenter.facilityName).to.equal('Facility Name');
      expect(formData.vaMedicalCenter.facilityLocation).to.equal(
        'Facility Location',
      );
      expect(formData.locationOfDeath.vaMedicalCenter).to.be.empty;
    });
    it('should update stateVeteransHome location', () => {
      const { formData, metadata } = migrations[2]({
        formData: {
          locationOfDeath: {
            location: 'stateVeteransHome',
            stateVeteransHome: {
              facilityName: 'Facility Name',
              facilityLocation: 'Facility Location',
            },
          },
        },
        metadata: {
          returnUrl: '/original-url',
        },
      });

      expect(metadata.returnUrl).to.equal('/original-url');
      expect(formData.locationOfDeath.location).to.equal('stateVeteransHome');
      expect(formData.stateVeteransHome.facilityName).to.equal('Facility Name');
      expect(formData.stateVeteransHome.facilityLocation).to.equal(
        'Facility Location',
      );
      expect(formData.locationOfDeath.stateVeteransHome).to.be.empty;
    });
    it('should update stateVeteransHome location', () => {
      const { formData, metadata } = migrations[2]({
        formData: {
          locationOfDeath: {
            location: 'other',
            other: 'Location',
          },
        },
        metadata: {
          returnUrl: '/original-url',
        },
      });

      expect(metadata.returnUrl).to.equal('/original-url');
      expect(formData.locationOfDeath.location).to.equal('other');
      expect(formData.locationOfDeath.other).to.equal('Location');
    });
  });

  context.skip('v4 migration', () => {
    it('should migrate toursOfDuty to new service period fields when serviceBranch maps cleanly', () => {
      const { formData, metadata } = migrations[3]({
        formData: {
          toursOfDuty: [
            {
              serviceBranch: 'Air Force',
              dateRange: {
                from: '2005-07-19',
                to: '2009-04-02',
              },
              placeOfEntry: 'Denver, CO',
              placeOfSeparation: 'Salt Lake City, UT',
              // legacy fields that may exist on old objects
              rank: 'E-4',
              unit: 'Unit 1',
            },
          ],
        },
        metadata: {
          returnUrl: '/some-old-url',
        },
      });

      expect(metadata.returnUrl).to.equal(
        '/claimant-information/relationship-to-veteran',
      );

      expect(formData).to.not.have.property('toursOfDuty');
      expect(formData.serviceBranch).to.equal('airForce');
      expect(formData.serviceDateRange).to.deep.equal({
        from: '2005-07-19',
        to: '2009-04-02',
      });
      expect(formData.placeOfSeparation).to.equal('Salt Lake City, UT');
    });

    it('should leave serviceBranch undefined when there is no one-to-one mapping but still migrate other fields', () => {
      const { formData, metadata } = migrations[3]({
        formData: {
          toursOfDuty: [
            {
              serviceBranch: 'Army National Guard',
              dateRange: {
                from: '2010-01-01',
                to: '2012-01-01',
              },
              placeOfSeparation: 'Ogden, UT',
            },
          ],
        },
        metadata: {
          returnUrl: '/some-old-url',
        },
      });

      expect(metadata.returnUrl).to.equal(
        '/claimant-information/relationship-to-veteran',
      );

      expect(formData).to.not.have.property('toursOfDuty');
      expect(formData).to.not.have.property('serviceBranch');
      expect(formData.serviceDateRange).to.deep.equal({
        from: '2010-01-01',
        to: '2012-01-01',
      });
      expect(formData.placeOfSeparation).to.equal('Ogden, UT');
    });

    it('should use the first toursOfDuty entry when multiple exist', () => {
      const { formData, metadata } = migrations[3]({
        formData: {
          toursOfDuty: [
            {
              serviceBranch: 'Navy',
              dateRange: {
                from: '2000-01-01',
                to: '2004-01-01',
              },
              placeOfSeparation: 'Norfolk, VA',
            },
            {
              serviceBranch: 'Army',
              dateRange: {
                from: '2005-01-01',
                to: '2009-01-01',
              },
              placeOfSeparation: 'Fort Bragg, NC',
            },
          ],
        },
        metadata: {
          returnUrl: '/some-old-url',
        },
      });

      expect(metadata.returnUrl).to.equal(
        '/claimant-information/relationship-to-veteran',
      );

      expect(formData).to.not.have.property('toursOfDuty');
      expect(formData.serviceBranch).to.equal('navy');
      expect(formData.serviceDateRange).to.deep.equal({
        from: '2000-01-01',
        to: '2004-01-01',
      });
      expect(formData.placeOfSeparation).to.equal('Norfolk, VA');
    });

    it('should always redirect to first page of application', () => {
      const input = {
        formData: {
          claimantEmail: 'user@example.com',
        },
        metadata: {
          returnUrl: '/original-url',
        },
      };

      const { formData, metadata } = migrations[3](input);

      expect(metadata.returnUrl).to.equal(
        '/claimant-information/relationship-to-veteran',
      );
      expect(formData).to.deep.equal({
        claimantEmail: 'user@example.com',
      });
    });
  });
});
