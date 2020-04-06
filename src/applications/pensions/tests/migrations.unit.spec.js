import migrations from '../migrations';

describe('Pension migrations', () => {
  it('should set url to service history if validation error', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        servicePeriods: [
          {
            activeServiceDateRange: {
              from: '2012-01-01',
            },
          },
        ],
        veteranDateOfBirth: '2013-01-01',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/military/history');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should set url to marriage page if dates are invalid', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        marriages: [
          {
            dateOfMarriage: '2012-01-01',
            'view:pastMarriage': {
              dateOfSeparation: '2011-01-01',
            },
          },
        ],
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/household/marriages/0');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should set url to spouse marriage page if dates are invalid', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        spouseMarriages: [
          {
            dateOfMarriage: '2012-01-01',
            dateOfSeparation: '2011-01-01',
          },
        ],
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/household/spouse-marriages/0');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should leave return url alone if no validation issues are found', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        spouseMarriages: [
          {
            dateOfMarriage: '2010-01-01',
            dateOfSeparation: '2011-01-01',
          },
        ],
        marriages: [
          {
            dateOfMarriage: '2010-01-01',
            'view:pastMarriage': {
              dateOfSeparation: '2011-01-01',
            },
          },
        ],
        servicePeriods: [
          {
            activeServiceDateRange: {
              from: '2014-01-01',
            },
          },
        ],
        veteranDateOfBirth: '2013-01-01',
      },
      metadata: {
        returnUrl: 'test',
      },
    });

    expect(metadata.returnUrl).toBe('test');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should leave return url alone if no matching data exists', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        veteranDateOfBirth: '2013-01-01',
      },
      metadata: {
        returnUrl: 'test',
      },
    });

    expect(metadata.returnUrl).toBe('test');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should set url to address page if zip is bad', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        veteranAddress: {
          country: 'USA',
          postalCode: '234444',
        },
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/additional-information/contact');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should set url to applicant info page if file number is bad', () => {
    const { formData, metadata } = migrations[2]({
      formData: {
        vaFileNumber: '2312311',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/applicant/information');
    expect(formData).toBeInstanceOf(Object);
  });
  it('should set url to spouse info page if file number is bad', () => {
    const { formData, metadata } = migrations[2]({
      formData: {
        vaFileNumber: '2312311',
        spouseVaFileNumber: '2312312',
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).toBe('/household/spouse-info');
    expect(formData).toBeInstanceOf(Object);
  });
});
