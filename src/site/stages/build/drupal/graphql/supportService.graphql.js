module.exports = `
  fragment supportService on NodeSupportService {
    entityId
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
