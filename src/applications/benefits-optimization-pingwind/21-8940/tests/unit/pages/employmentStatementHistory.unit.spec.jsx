import { expect } from 'chai';
import { employmentAppliedFields } from '../../../definitions/constants';
import { employmentStatementHistoryOptions } from '../../../pages/employmentStatementHistory';

describe('21-8940 employmentStatementHistory options', () => {
  const { isItemIncomplete, text } = employmentStatementHistoryOptions;

  it('detects incomplete items', () => {
    expect(isItemIncomplete({})).to.be.true;
    expect(
      isItemIncomplete({
        [employmentAppliedFields.employerName]: 'Acme',
        [employmentAppliedFields.employerAddress]: { street: '1 Main St' },
        [employmentAppliedFields.typeOfWork]: 'Engineer',
        [employmentAppliedFields.dateApplied]: '2024-01-01',
      }),
    ).to.be.false;
  });

  it('builds item names and card descriptions', () => {
    expect(
      text.getItemName({
        [employmentAppliedFields.employerName]: 'Widget Co',
      }),
    ).to.equal('Widget Co');
    expect(text.getItemName({})).to.equal('Employer');

    const descriptionFull = text.cardDescription({
      [employmentAppliedFields.typeOfWork]: 'Technician',
      [employmentAppliedFields.dateApplied]: '2024-03-01',
    });

    const descriptionPartial = text.cardDescription({
      [employmentAppliedFields.dateApplied]: '2024-03-01',
    });

    const descriptionEmpty = text.cardDescription({});

    expect(descriptionFull).to.include('Technician');
    expect(descriptionFull).to.include('Applied:');
    expect(descriptionPartial).to.include('Applied:');
    expect(descriptionEmpty).to.equal('');
  });
});
