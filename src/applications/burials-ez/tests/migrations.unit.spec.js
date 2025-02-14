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
});
