module.exports = `
fragment audienceTopics on ParagraphAudienceTopics {
  fieldAudienceBeneficiares {
    entity {
      ... taxonomyTermAudienceBeneficiaries
    }
  }
  fieldNonBeneficiares {
    entity {
      ... taxonomyTermAudienceNonBeneficiaries
    }
  }
  fieldTopics {
    entity {
      ... taxonomyTermTopics
    }
  }
}
`;
