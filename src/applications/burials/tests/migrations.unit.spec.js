import migrations from '../migrations';

describe('Burials migrations', () => {
  it('should set url to address page if zip is bad', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        claimantAddress: {
          country: 'USA',
          postalCode: '234444',
        },
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/claimant-contact-information');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should set url to veteran info page if file number is bad', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        vaFileNumber: '2312311',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/veteran-information');
    expect(formData).toBeInstanceOf(Object);
  });
});
