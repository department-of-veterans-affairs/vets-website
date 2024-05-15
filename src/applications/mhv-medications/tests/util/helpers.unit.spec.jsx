import { expect } from 'chai';
import {
  EMPTY_FIELD,
  imageRootUri,
  medicationsUrls,
} from '../../util/constants';
import {
  dateFormat,
  extractContainedResource,
  generateMedicationsPDF,
  getImageUri,
  getReactions,
  processList,
  validateField,
  createNoDescriptionText,
  createVAPharmacyText,
  fromToNumbs,
  createBreadcrumbs,
} from '../../util/helpers';

describe('Date Format function', () => {
  it("should return 'None noted' when no values are passed", () => {
    expect(dateFormat()).to.equal(EMPTY_FIELD);
  });
  it('should return a formatted date', () => {
    expect(dateFormat('2023-10-26T20:18:00.000Z', 'MMMM D, YYYY')).to.equal(
      'October 26, 2023',
    );
  });
});

describe('Generate PDF function', () => {
  it('should throw an error', () => {
    const error = generateMedicationsPDF();
    expect(error).to.exist;
  });
});

describe('Validate Field function', () => {
  it('should return the value', () => {
    expect(validateField('Test')).to.equal('Test');
  });

  it("should return 'None noted' when no values are passed", () => {
    expect(validateField()).to.equal(EMPTY_FIELD);
  });

  it('should return 0', () => {
    expect(validateField(0)).to.equal(0);
  });
});

describe('Image URI function', () => {
  it('should return the URI', () => {
    expect(getImageUri('1test')).to.equal(`${imageRootUri}1/NDC1test.jpg`);
  });

  it('should support OTHER folder', () => {
    expect(getImageUri()).to.equal(`${imageRootUri}other/NDCundefined.jpg`);
  });
});

describe('processList function', () => {
  it('returns an array of strings, separated by a period and a space, when there is more than 1 item in the list', () => {
    const list = ['a', 'b', 'c'];
    const result = processList(list);
    expect(result).to.eq('a. b. c');
  });
  it('returns the single item as string, when there is only 1 item in the list', () => {
    const list = ['a'];
    const result = processList(list);
    expect(result).to.eq('a');
  });
  it('returns EMPTY_FIELD value if there are no items in the list', () => {
    const list = [];
    const result = processList(list);
    expect(result).to.eq(EMPTY_FIELD);
  });
});

describe('getReactions', () => {
  it('returns an empty array if the record passed has no reactions property', () => {
    const record = {};
    const reactions = getReactions(record);
    expect(reactions.length).to.eq(0);
  });
});

describe('extractContainedResource', () => {
  it('should extract the contained resource when provided a valid reference ID', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }, { id: 'b2', type: 'TypeB' }],
    };

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(resource.contained.find(e => e.id === 'a1'));
  });

  it('should return null if resource does not contain the "contained" property', () => {
    const resource = {};

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(null);
  });

  it('should return null if "contained" property is not an array', () => {
    const resource = {
      contained: 'not-an-array',
    };

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(null);
  });

  it('should return null if reference ID is not provided', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }],
    };

    const result = extractContainedResource(resource, '');
    expect(result).to.eq(null);
  });

  it('should return null if no match is found in the "contained" array', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }],
    };

    const result = extractContainedResource(resource, '#b2');
    expect(result).to.eq(null);
  });
});

describe('createNoDescriptionText', () => {
  it('should include a phone number if provided', () => {
    expect(createNoDescriptionText('555-111-5555')).to.eq(
      'No description available. Call your pharmacy at 555-111-5555 if you need help identifying this medication.',
    );
  });

  it('should create a string even if no phone number provided', () => {
    expect(createNoDescriptionText()).to.eq(
      'No description available. Call your pharmacy if you need help identifying this medication.',
    );
  });

  describe('createVAPharmacyText', () => {
    it('should include a phone number if provided', () => {
      expect(createVAPharmacyText('555-111-5555')).to.eq(
        'your VA pharmacy at 555-111-5555',
      );
    });

    it('should create a string even if no phone number provided', () => {
      expect(createVAPharmacyText()).to.eq('your VA pharmacy');
    });
  });
});

describe('fromToNumbs', () => {
  it('should return [0, 0]', () => {
    const numbers = fromToNumbs(1, 0, [], 1);
    expect(numbers[0]).to.eq(0);
    expect(numbers[1]).to.eq(0);
  });

  it('should return [1, 2]', () => {
    const numbers = fromToNumbs(1, 2, [1, 2], 2);
    expect(numbers[0]).to.eq(1);
    expect(numbers[1]).to.eq(2);
  });
});

describe('createBreadcrumbs', () => {
  const locationMock = pathname => ({ pathname });
  const prescriptionMock = {
    prescriptionId: '123',
    prescriptionName: 'Aspirin',
  };

  const defaultBreadcrumb = {
    href: medicationsUrls.MHV_HOME,
    label: 'My HealtheVet home',
  };

  it('should return empty array for an unknown path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock('/unknown/path'),
      null,
      1,
    );
    expect(breadcrumbs).to.deep.equal([]);
  });

  it('should return breadcrumbs for the ABOUT path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.ABOUT),
      null,
      1,
    );
    expect(breadcrumbs).to.deep.equal([
      defaultBreadcrumb,
      { href: medicationsUrls.MEDICATIONS_ABOUT, label: 'About medications' },
    ]);
  });

  it('should return breadcrumbs for the BASE path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.BASE),
      null,
      2,
    );
    expect(breadcrumbs).to.deep.equal([
      defaultBreadcrumb,
      { href: medicationsUrls.MEDICATIONS_ABOUT, label: 'About medications' },
      {
        href: `${medicationsUrls.MEDICATIONS_URL}?page=2`,
        label: 'Medications',
      },
    ]);
  });

  it('should return breadcrumbs for the BASE path with empty currentPage', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.BASE),
      null,
      undefined,
    );
    expect(breadcrumbs).to.deep.equal([
      defaultBreadcrumb,
      { href: medicationsUrls.MEDICATIONS_ABOUT, label: 'About medications' },
      {
        href: `${medicationsUrls.MEDICATIONS_URL}?page=1`,
        label: 'Medications',
      },
    ]);
  });

  it('should return breadcrumbs for the REFILL path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.REFILL),
      null,
      1,
    );
    expect(breadcrumbs).to.deep.equal([
      defaultBreadcrumb,
      { href: medicationsUrls.MEDICATIONS_ABOUT, label: 'About medications' },
      {
        href: medicationsUrls.MEDICATIONS_REFILL,
        label: 'Refill prescriptions',
      },
    ]);
  });

  it('should return breadcrumbs for the DETAILS path with a prescription', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.DETAILS),
      prescriptionMock,
      3,
    );
    expect(breadcrumbs).to.deep.equal([
      defaultBreadcrumb,
      { href: medicationsUrls.MEDICATIONS_ABOUT, label: 'About medications' },
      {
        href: `${medicationsUrls.MEDICATIONS_URL}?page=3`,
        label: 'Medications',
      },
      {
        href: `/${prescriptionMock.prescriptionId}`,
        label: prescriptionMock.prescriptionName,
      },
    ]);
  });

  it('should return breadcrumbs for the DETAILS path with a prescription and empty currentPage', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.DETAILS),
      prescriptionMock,
      undefined,
    );
    expect(breadcrumbs).to.deep.equal([
      defaultBreadcrumb,
      { href: medicationsUrls.MEDICATIONS_ABOUT, label: 'About medications' },
      {
        href: `${medicationsUrls.MEDICATIONS_URL}?page=1`,
        label: 'Medications',
      },
      {
        href: `/${prescriptionMock.prescriptionId}`,
        label: prescriptionMock.prescriptionName,
      },
    ]);
  });
});
