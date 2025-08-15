import { expect } from 'chai';
import { renderHook, act } from '@testing-library/react-hooks';
import { LABELS, useSignaturesSync } from '../../../hooks/useSignatureSync';

const MOCK_FULL_NAME = { first: 'John', last: 'Smith' };
const DEFAULT_FORM_DATA = {
  veteranFullName: MOCK_FULL_NAME,
  primaryFullName: MOCK_FULL_NAME,
  signAsRepresentativeYesNo: 'no',
  'view:hasPrimaryCaregiver': true,
};
const EXPECTED_SIGNATURE_VALUE = {
  checked: false,
  dirty: false,
  matches: true,
  value: 'John Smith',
};

describe('CG `useSignaturesSync` hook', () => {
  const subject = ({ formData = DEFAULT_FORM_DATA, isRep = false } = {}) => {
    const { result, rerender } = renderHook(props => useSignaturesSync(props), {
      initialProps: { formData, isRep },
    });

    const updateSignature = (label, updates) =>
      act(() => {
        result.current.setSignatures(prev => ({
          ...prev,
          [label]: {
            ...prev[label],
            ...updates,
          },
        }));
      });

    const updateProps = props => act(() => rerender(props));

    return { result, updateProps, updateSignature };
  };

  it('should return correct default state based on formData', () => {
    const { result } = subject();
    const { requiredElements, signatures } = result.current;
    const expectedKeys = [LABELS.veteran, LABELS.primary];
    expect(requiredElements.map(r => r.label)).to.include.members(expectedKeys);
    expect(Object.keys(signatures)).to.have.members(expectedKeys);
    expect(signatures[LABELS.veteran]).to.deep.eq(EXPECTED_SIGNATURE_VALUE);
  });

  it('should update signatures when required fields change', () => {
    const initFormData = {
      ...DEFAULT_FORM_DATA,
      'view:hasPrimaryCaregiver': true,
      'view:hasSecondaryCaregiverOne': false,
    };
    const { result, updateProps } = subject({ formData: initFormData });

    const expectedKeys = [LABELS.veteran, LABELS.primary];
    expect(Object.keys(result.current.signatures)).to.have.members(
      expectedKeys,
    );

    // add secondary caregiver to form data
    const updatedExpectedKeys = [...expectedKeys, LABELS.secondaryOne];
    updateProps({
      formData: {
        ...initFormData,
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneFullName: MOCK_FULL_NAME,
      },
    });
    expect(Object.keys(result.current.signatures)).to.have.members(
      updatedExpectedKeys,
    );
    expect(result.current.signatures[LABELS.secondaryOne]).to.deep.eq(
      EXPECTED_SIGNATURE_VALUE,
    );
  });

  it('should correctly switch between Veteran and representative signature', () => {
    const { result, updateProps } = subject();

    const expectedKeys = [LABELS.veteran, LABELS.primary];
    expect(Object.keys(result.current.signatures)).to.have.members(
      expectedKeys,
    );

    // toggle to Veteran's representative signature
    const updatedExpectedKeys = [LABELS.representative, LABELS.primary];
    updateProps({
      formData: {
        ...DEFAULT_FORM_DATA,
        signAsRepresentativeYesNo: 'yes',
      },
      isRep: true,
    });
    expect(Object.keys(result.current.signatures)).to.have.members(
      updatedExpectedKeys,
    );
  });

  it('should preserve existing signature values when labels stay the same', () => {
    const { result, updateProps, updateSignature } = subject();

    // simulate a filled signature & re-render with same labels
    updateSignature(LABELS.veteran, { value: 'John Smith' });
    updateProps({ formData: { ...DEFAULT_FORM_DATA } });

    expect(result.current.signatures[LABELS.veteran].value).to.eq('John Smith');
  });

  it('should populate the full name for non-representative signatures', () => {
    const { result } = subject();
    const { signatures } = result.current;

    expect(signatures[LABELS.veteran].value).to.eq('John Smith');
    expect(signatures[LABELS.veteran].matches).to.be.true;

    expect(signatures[LABELS.primary].value).to.eq('John Smith');
    expect(signatures[LABELS.primary].matches).to.be.true;
  });

  it('should not populate the full name for representative signature', () => {
    const { result } = subject({
      formData: {
        ...DEFAULT_FORM_DATA,
        signAsRepresentativeYesNo: 'yes',
      },
      isRep: true,
    });

    const repSig = result.current.signatures[LABELS.representative];
    expect(repSig.value).to.eq('');
    expect(repSig.matches).to.be.false;
  });

  it('should update the populated value for non-representative signatures when the form data changes', () => {
    const { result, updateProps } = subject();
    expect(result.current.signatures[LABELS.primary].value).to.eq('John Smith');

    // update name in form data
    updateProps({
      formData: {
        ...DEFAULT_FORM_DATA,
        primaryFullName: { first: 'Jane', middle: 'Marie', last: 'Doe' },
      },
    });

    expect(result.current.signatures[LABELS.primary].value).to.eq(
      'Jane Marie Doe',
    );
    expect(result.current.signatures[LABELS.primary].matches).to.be.true;
  });

  it('should not populate or update representative signature when the form data changes', () => {
    const { result, updateProps } = subject({
      formData: {
        ...DEFAULT_FORM_DATA,
        signAsRepresentativeYesNo: 'yes',
      },
      isRep: true,
    });
    expect(result.current.signatures[LABELS.representative].value).to.equal('');
    expect(result.current.signatures[LABELS.representative].matches).to.be
      .false;

    updateProps({
      isRep: true,
      formData: {
        ...DEFAULT_FORM_DATA,
        signAsRepresentativeYesNo: 'yes',
        veteranFullName: { first: 'John', last: 'Doe' },
      },
    });

    expect(result.current.signatures[LABELS.representative].value).to.equal('');
    expect(result.current.signatures[LABELS.representative].matches).to.be
      .false;
  });
});
