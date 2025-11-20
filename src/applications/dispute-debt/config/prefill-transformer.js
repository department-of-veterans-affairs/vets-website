/* vets-api/config/form_profile_mappings/DISPUTE-DEBT.yml */
import { selectProfile } from 'platform/user/selectors';

export default function prefillTransformer(pages, formData, metadata, state) {
  const { icn } = selectProfile(state);

  return {
    pages,
    formData: {
      veteran: {
        ...formData?.veteran,
        icn,
      },
    },
    metadata,
  };
}
