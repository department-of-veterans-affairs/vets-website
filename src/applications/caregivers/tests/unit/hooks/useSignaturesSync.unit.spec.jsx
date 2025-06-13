import { expect } from 'chai';
import { renderHook, act } from '@testing-library/react-hooks';
import { LABELS, useSignaturesSync } from '../../../hooks/useSignatureSync';
import { DEFAULT_SIGNATURE_STATE } from '../../../utils/constants';

const MOCK_FULL_NAME = { first: 'John', last: 'Smith' };
const DEFAULT_FORM_DATA = {
  veteranFullName: MOCK_FULL_NAME,
  primaryFullName: MOCK_FULL_NAME,
  signAsRepresentativeYesNo: 'no',
  'view:hasPrimaryCaregiver': true,
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
    expect(signatures[LABELS.veteran]).to.deep.equal(DEFAULT_SIGNATURE_STATE);
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
    expect(result.current.signatures[LABELS.secondaryOne]).to.deep.equal(
      DEFAULT_SIGNATURE_STATE,
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
});
