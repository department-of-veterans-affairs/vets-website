import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { toHash } from '../../../../../shared/utilities';
import MedicareParticipantField from '../../../../components/FormFields/MedicareParticipantField';
import content from '../../../../locales/en/content.json';

const MSG_NA = content['medicare--participant-default'];
const DEFAULT_PROPS = { index: '0', required: true, label: 'Select applicant' };

describe('1010d <MedicareParticipantField>', () => {
  const subject = ({ applicants = [], medicare = [], formData = '' } = {}) => {
    const mockStore = {
      getState: () => ({ form: { data: { applicants, medicare } } }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const childrenProps = {
      formData,
      onBlur: () => {},
      onChange: () => {},
      schema: { type: 'string' },
      idSchema: { $id: 'root_medicareParticipant' },
    };
    const props = { ...DEFAULT_PROPS, childrenProps };
    const { container } = render(
      <Provider store={mockStore}>
        <MedicareParticipantField {...props} />
      </Provider>,
    );
    const selectors = () => ({
      vaRadio: container.querySelector('va-radio'),
      vaRadioOptions: container.querySelectorAll('va-radio-option'),
    });
    return { selectors };
  };

  it('should render default item when no applicants are populated', () => {
    const { selectors } = subject();
    const { vaRadioOptions } = selectors();
    expect(vaRadioOptions).to.have.lengthOf(1);
    expect(vaRadioOptions[0]).to.have.attr('label', MSG_NA);
  });

  it('should render available applicants when populated', () => {
    const { selectors } = subject({
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'John', last: 'Doe' },
        },
        {
          applicantSsn: '321321321',
          applicantName: { first: 'Jane', last: 'Smith' },
        },
      ],
    });
    const { vaRadioOptions } = selectors();
    expect(vaRadioOptions).to.have.lengthOf(2);
  });

  it('should filter out applicants already assigned to Medicare plans', () => {
    const { selectors } = subject({
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'John', last: 'Doe' },
        },
        {
          applicantSsn: '321321321',
          applicantName: { first: 'Jane', last: 'Smith' },
        },
      ],
      medicare: [{ medicareParticipant: toHash('123123123') }],
    });
    const { vaRadioOptions } = selectors();
    expect(vaRadioOptions).to.have.lengthOf(1);
    expect(vaRadioOptions[0]).to.have.attr('label', 'Jane Smith');
  });

  it('should always render currently selected applicant', () => {
    const currentHash = toHash('123123123');
    const { selectors } = subject({
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'John', last: 'Doe' },
        },
      ],
      medicare: [{ medicareParticipant: currentHash }],
      formData: currentHash,
    });
    const { vaRadioOptions } = selectors();
    expect(vaRadioOptions).to.have.lengthOf(1);
    expect(vaRadioOptions[0]).to.have.attr('label', 'John Doe');
    expect(vaRadioOptions[0]).to.have.attr('checked', 'true');
  });
});
