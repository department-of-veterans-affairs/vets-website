/**
 * A promo block in Drupal
 */

const promo = `
   fragment promo on BlockContentPromo {
    fieldImage {
      entity {
        ... on MediaImage {
          image {
            url
            alt
            title
            width
            height
            derivative(style: CROP_FREEFORM) {
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
