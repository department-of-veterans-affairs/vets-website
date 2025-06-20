import { readOnlyCertifyingOfficialIntro } from './pages/readOnlyCertifyingOfficialIntro';

export const getReadOnlyPrimaryOfficialTitle = item => {
  let title = null;

  if (item) {
    const first = item?.fullName?.first || 'Certifying';
    const last = item?.fullName?.last || 'Official';
    title = `${first} ${last}`;
  }

  return title;
};

export const readOnlyCertifyingOfficialArrayOptions = {
  arrayPath: 'readOnlyCertifyingOfficials',
  nounSingular: 'certifying official',
  nounPlural: 'certifying official',
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
