import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from '../../helpers';
import transform from '../../config/transform';

describe('transform utility function', () => {
  let form;
  let getFTECalcsStub;

  beforeEach(() => {
    form = {
      data: {
        programs: [
          {
            programName: 'Program A',
            supportedStudents: '10',
            fte: {
              totalFTE: 0,
              supportedPercentageFTE: 0,
            },
          },
          {
            programName: 'Program B',
            supportedStudents: '9',
            fte: {
              totalFTE: 0,
              supportedPercentageFTE: 0,
            },
          },
        ],
      },
    };
    getFTECalcsStub = sinon.stub(helpers, 'getFTECalcs');
  });

  afterEach(() => {
    getFTECalcsStub.restore();
  });
  it('should not modify FTE fields if the program has fewer than 10 supported students', () => {
    form.data.programs = [
      {
        programName: 'Program C',
        supportedStudents: '8',
        fte: {
          totalFTE: 0,
          supportedPercentageFTE: 0,
        },
      },
    ];

    const resultString = transform(form);
    const resultObject = JSON.parse(resultString);
    expect(resultObject.educationBenefitsClaim).to.exist;
    expect(resultObject.educationBenefitsClaim.form).to.exist;
  });
});
