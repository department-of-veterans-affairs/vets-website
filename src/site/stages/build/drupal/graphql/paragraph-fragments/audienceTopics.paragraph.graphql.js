module.exports = `
fragment audienceTopics on ParagraphAudienceTopics {
  fieldAudienceBeneficiares {
    entity {
      ... taxonomyTermAudienceBeneficiaries
    }
  }
  fieldTopics {
    entity {
      ... taxonomyTermTopics
    }
  }
}
`;
