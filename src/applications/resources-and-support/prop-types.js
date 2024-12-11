import PropTypes from 'prop-types';

import { ENTITY_BUNDLES } from './constants';

export const TaxonomyTerm = PropTypes.shape({
  entityUrl: PropTypes.shape({
    path: PropTypes.string,
  }),
  name: PropTypes.string,
});

export const Article = PropTypes.shape({
  entityBundle: PropTypes.oneOf(Object.values(ENTITY_BUNDLES)),
  entityUrl: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  introText: PropTypes.string.isRequired,
  fieldPrimaryCategory: PropTypes.shape({
    entity: TaxonomyTerm,
  }),
  fieldOtherCategories: PropTypes.arrayOf(
    PropTypes.shape({
      entity: TaxonomyTerm,
    }),
  ),
  fieldTags: PropTypes.shape({
    entity: PropTypes.shape({
      fieldAudienceBeneficiares: PropTypes.shape({
        entity: TaxonomyTerm,
      }),
      fieldTopics: PropTypes.arrayOf(
        PropTypes.shape({
          entity: TaxonomyTerm,
        }),
      ),
    }),
  }),
});
