module.exports = `
  fragment supportService on NodeSupportService {
    title
    fieldLink {
      title
      url {
        path
        routed
      }
    }
    fieldPhoneNumber
  }
`;
