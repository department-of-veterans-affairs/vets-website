/**
 * The global header megamenu from Drupal.
 *
 */

module.exports = `
      ... on MenuLinkContentHeaderMegamenu {
        menuName
        parent
        weight
        link {
          url {
            path
          }
        }
        fieldPromoReference {
          ... on FieldMenuLinkContentHeaderMegamenuFieldPromoReference {
            entity {
              ... on BlockContentPromo {
                fieldImage {
                  entity {
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
                  ...on FieldBlockContentPromoFieldPromoLink {
                    entity {
                      ... on ParagraphLinkTeaser {
                        fieldLink {
                          url {
                            path
                          }
                          title
                          options
                        }
                        fieldLinkSummary
                      }
                    }
                  }
                }
              }
            }
          }
        }
        title
        uuid
      }
`;
