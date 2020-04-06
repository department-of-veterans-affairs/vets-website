import migrations from '../../../feedback-tool/config/migrations';

describe('Feedback tool migrations', () => {
  test('should convert keys in programs object', () => {
    const formData = {
      educationDetails: {
        programs: {
          'post9::11 ch 33': true,
          'mGIBAd ch 30': false,
        },
      },
    };

    const result = migrations[0]({ formData, metadata: {} });

    expect(result.formData.educationDetails.programs.chapter33).toBe(true);
    expect(result.formData.educationDetails.programs.chapter30).toBe(false);

    expect(
      result.formData.educationDetails.programs['Post-9/11 Ch 33'],
    ).toBeUndefined();
    expect(
      result.formData.educationDetails.programs['MGIB-AD Ch 30'],
    ).toBeUndefined();
  });

  test('should convert keys in view:assistance object', () => {
    const formData = {
      educationDetails: {
        assistance: {
          'view:assistance': {
            TA: true,
            'TA-AGR': false,
          },
        },
      },
    };

    const result = migrations[0]({ formData, metadata: {} });

    expect(
      result.formData.educationDetails.assistance['view:assistance'].ta,
    ).toBe(true);
    expect(
      result.formData.educationDetails.assistance['view:assistance'].taAgr,
    ).toBe(false);

    expect(
      result.formData.educationDetails.assistance['view:assistance'].TA,
    ).toBeUndefined();
    expect(
      result.formData.educationDetails.assistance['view:assistance']['TA-AGR'],
    ).toBeUndefined();
  });

  test('should convert ffa key in assistance object', () => {
    const formData = {
      educationDetails: {
        assistance: {
          'view:FFA': {
            FFA: false,
          },
        },
      },
    };

    const result = migrations[0]({ formData, metadata: {} });

    expect(result.formData.educationDetails.assistance['view:ffa'].ffa).toBe(
      false,
    );

    expect(
      result.formData.educationDetails.assistance['view:FFA'],
    ).toBeUndefined();
  });
});
