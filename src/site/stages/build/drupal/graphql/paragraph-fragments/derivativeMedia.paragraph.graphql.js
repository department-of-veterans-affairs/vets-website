const derivativeImage = thumbnail => `
  fieldMedia {
    entity {
      ... on MediaImage {
        image {
          alt
          title
          derivative(style: ${thumbnail}) {
            url
            width
            height
          }
        }
      }
    }
  }
`;

module.exports = { derivativeImage };
