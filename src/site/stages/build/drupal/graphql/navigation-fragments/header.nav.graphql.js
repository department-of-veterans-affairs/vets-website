/**
 * The global header megamenu from Drupal.
 *
 */

module.exports = `
{
  menuLinkContentQuery(limit: 1000) {
    entities {
      ... on MenuLinkContentHeaderMegamenu {
        parent
        link {
          url {
            path
          }
        }
        fieldPromoReference {
          ... on FieldMenuLinkContentHeaderMegamenuFieldPromoReference {
            targetId
            entity {
              entityId
              entityLabel
              ... on BlockContentPromo {
                fieldImage {
                  targetId
                }
                fieldPromoLink {
                  targetId
                  targetRevisionId
                }
              }
            }
          }
        }
        title
        uuid
        bundle {
          entity {
            entityLabel
         } 
      }
      weight
      enabled
      }
    }
  }
}     
`;
