module.exports = `
fragment audienceTopics on ParagraphAudienceTopics {
  fieldTopics {
    entity {
      ... taxonomyTermTopics
    }
  }
}
`;
