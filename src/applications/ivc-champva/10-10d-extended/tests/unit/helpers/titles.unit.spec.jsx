import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { toHash } from '../../../../shared/utilities';
import { medicarePageTitleUI } from '../../../helpers';

describe('1010d `medicarePageTitleUI` util', () => {
  const DEFAULT_ITEM = { medicareParticipant: toHash('123123123') };

  const subject = ({ applicants, item = DEFAULT_ITEM } = {}) => {
    const uiSchema = medicarePageTitleUI('Medicare plan types');
    const TitleComponent = uiSchema['ui:title'];
    const mockStore = {
      getState: () => ({
        form: { data: { applicants } },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <div>{TitleComponent({ formData: item })}</div>
      </Provider>,
    );
    return container.textContent;
  };

  it('should return a UI schema object with ui:title property', () => {
    const res = medicarePageTitleUI('Medicare plan types');
    expect(res).to.have.property('ui:title');
  });

  it('should generate title with participant name when applicant found', () => {
    const res = subject({
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'John', last: 'Smith' },
        },
      ],
    });
    expect(res).to.equal('John Smith’s Medicare plan types');
  });

  it('should generate title with `Applicant` when no match found', () => {
    const res = subject({
      item: { medicareParticipant: toHash('321321321') },
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'Jane', last: 'Doe' },
        },
      ],
    });
    expect(res).to.equal('Applicant’s Medicare plan types');
  });

  it('should generate title with `No participant` when item is null', () => {
    const res = subject({ item: null, applicants: [] });
    expect(res).to.equal('No participant’s Medicare plan types');
  });

  it('should include description when provided', () => {
    const res = medicarePageTitleUI('Medicare plan types', 'Test description');
    expect(res).to.have.property('ui:title');
    expect(typeof res['ui:title']).to.equal('function');
  });

  it('should generate title with over-65 applicant name when no participant match', () => {
    const res = subject({
      item: { medicareParticipant: toHash('999999999') },
      applicants: [
        {
          applicantSsn: '123123123',
          applicantDob: '1950-01-01',
          applicantName: { first: 'Elder', last: 'Applicant' },
        },
        {
          applicantSsn: '321321321',
          applicantDob: '2000-01-01',
          applicantName: { first: 'Younger', last: 'Applicant' },
        },
      ],
    });
    expect(res).to.equal('Elder Applicant’s Medicare plan types');
  });
});
