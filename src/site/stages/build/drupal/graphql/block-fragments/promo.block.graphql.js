/**
 * A promo block in Drupal
 */

const promo = `
   fragment promo on BlockContentPromo {
    fieldImage {
      entity {
        entityId
        ... on MediaImage {
          image {
            url
            alt
            title
            width
            height
            derivative(style: _32MEDIUMTHUMBNAIL) {
                url
                width
                height
            }
          }
        }
      }
    }
    fieldPromoLink {
      entity {
        ... linkTeaser
      }
    }
  }
`;

const FIELD_PROMO = `
  fieldPromo {
    entity {
      ... promo
    }
  }
`;
module.exports = { promo, FIELD_PROMO };
