import { expect } from 'chai';
import migrations from '../../config/migrations';

describe('Feedback tool migrations', () => {
  it('should convert keys in programs object', () => {
    const formData = {
      educationDetails: {
        programs: {
          'post9::11 ch 33': true,
          'mGIBAd ch 30': false,
        },
      },
    };

    const result = migrations[0]({ formData, metadata: {} });

    expect(result.formData.educationDetails.programs.chapter33).to.be.true;
    expect(result.formData.educationDetails.programs.chapter30).to.be.false;

    expect(result.formData.educationDetails.programs['Post-9/11 Ch 33']).to.be
      .undefined;
    expect(result.formData.educationDetails.programs['MGIB-AD Ch 30']).to.be
      .undefined;
  });

  it('should convert keys in view:assistance object', () => {
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

    expect(result.formData.educationDetails.assistance['view:assistance'].ta).to
      .be.true;
    expect(result.formData.educationDetails.assistance['view:assistance'].taAgr)
      .to.be.false;

    expect(result.formData.educationDetails.assistance['view:assistance'].TA).to
      .be.undefined;
    expect(
      result.formData.educationDetails.assistance['view:assistance']['TA-AGR'],
    ).to.be.undefined;
  });

  it('should convert ffa key in assistance object', () => {
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

    expect(result.formData.educationDetails.assistance['view:ffa'].ffa).to.be
      .false;

    expect(result.formData.educationDetails.assistance['view:FFA']).to.be
      .undefined;
  });
});
