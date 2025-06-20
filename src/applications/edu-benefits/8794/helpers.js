import { readOnlyCertifyingOfficialIntro } from './pages/readOnlyCertifyingOfficialIntro';

export const getReadOnlyPrimaryOfficialTitle = item => {
  if (!item) return null;

  const first = (item.fullName?.first || '').trim() || 'Certifying';
  const middle = (item.fullName?.middle || '').trim();
  const last = (item.fullName?.last || '').trim() || 'Official';

  return [first, middle, last].filter(Boolean).join(' ');
};

export const readOnlyCertifyingOfficialArrayOptions = {
  arrayPath: 'readOnlyCertifyingOfficials',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
  text: {
    getItemName: item => getReadOnlyPrimaryOfficialTitle(item),
    summaryTitleWithoutItems: 'Add read-only certifying officials',
    summaryTitle: props => {
      return `Review your read-only certifying ${
        props?.formData?.readOnlyCertifyingOfficials?.length > 1
          ? 'officials'
          : 'official'
      }`;
    },
    summaryDescriptionWithoutItems: props => {
      const count = props.formData?.readOnlyCertifyingOfficials?.length ?? 0;
      return count > 0 ? null : readOnlyCertifyingOfficialIntro;
    },
  },
};
