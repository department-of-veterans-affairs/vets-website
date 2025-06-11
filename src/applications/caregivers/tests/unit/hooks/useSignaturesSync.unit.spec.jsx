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
  it('should return correct default state based on formData', () => {
    const { result } = renderHook(() =>
      useSignaturesSync({ formData: DEFAULT_FORM_DATA, isRep: false }),
    );
    const { requiredElements, signatures } = result.current;

    expect(requiredElements.map(r => r.label)).to.include.members([
      LABELS.veteran,
      LABELS.primary,
    ]);

    expect(Object.keys(signatures)).to.have.members([
      LABELS.veteran,
      LABELS.primary,
    ]);

    expect(signatures[LABELS.veteran]).to.deep.equal(DEFAULT_SIGNATURE_STATE);
  });

  it('should update signatures when `requiredElements` change', () => {
    const initFormData = {
      ...DEFAULT_FORM_DATA,
      'view:hasPrimaryCaregiver': true,
      'view:hasSecondaryCaregiverOne': false,
    };
    const { result, rerender } = renderHook(
      ({ formData, isRep }) => useSignaturesSync({ formData, isRep }),
      {
        initialProps: { formData: initFormData, isRep: false },
      },
    );

    expect(result.current.signatures).to.have.all.keys([
      LABELS.veteran,
      LABELS.primary,
    ]);

    // add secondary caregiver to form data, result should still include prior
    // values + new one with default
    const updatedFormData = {
      ...initFormData,
      'view:hasSecondaryCaregiverOne': true,
      secondaryOneFullName: MOCK_FULL_NAME,
    };

    act(() => {
      rerender({ formData: updatedFormData, isRep: false });
    });

    expect(result.current.signatures).to.have.all.keys([
      LABELS.veteran,
      LABELS.primary,
      LABELS.secondaryOne,
    ]);

    expect(result.current.signatures[LABELS.secondaryOne]).to.deep.equal(
      DEFAULT_SIGNATURE_STATE,
    );
  });

  it('should correctly switch between Veteran and representative signature', () => {
    const { result, rerender } = renderHook(
      ({ formData, isRep }) => useSignaturesSync({ formData, isRep }),
      {
        initialProps: { formData: DEFAULT_FORM_DATA, isRep: false },
      },
    );

    expect(result.current.signatures).to.have.all.keys([
      LABELS.veteran,
      LABELS.primary,
    ]);

    // toggle to Veteran's representative signature
    const updatedFormData = {
      ...DEFAULT_FORM_DATA,
      signAsRepresentativeYesNo: 'yes',
    };

    act(() => {
      rerender({ formData: updatedFormData, isRep: true });
    });

    expect(result.current.signatures).to.have.all.keys([
      LABELS.representative,
      LABELS.primary,
    ]);
  });

  it('should preserve existing signature values when labels stay the same', () => {
    const { result, rerender } = renderHook(
      ({ formData, isRep }) => useSignaturesSync({ formData, isRep }),
      {
        initialProps: { formData: DEFAULT_FORM_DATA, isRep: false },
      },
    );

    // simulate a filled signature & re-render with same labels
    act(() => {
      result.current.setSignatures(prev => ({
        ...prev,
        [LABELS.veteran]: {
          ...prev[LABELS.veteran],
          value: 'John Smith',
        },
      }));
    });

    act(() => {
      rerender({ formData: { ...DEFAULT_FORM_DATA }, isRep: false });
    });

    expect(result.current.signatures[LABELS.veteran].value).to.equal(
      'John Smith',
    );
  });
});
