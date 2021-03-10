const policiesPageFragment = `
  fragment policiesPageFragment on NodeVamcSystemPoliciesPage {
    title
    status
    entityBundle
    entityUrl {
      path
    }    
    fieldVamcVisitationPolicy {
      processed
    }
    fieldVamcOtherPolicies {
      processed
    }
  }
`;

// TODO: add when content has been published:
// query GetPolicyPages($onlyPublishedContent: Boolean!) {
// { field: "status", value: ["1"], enabled: $onlyPublishedContent },

const GetPolicyPages = `
  ${policiesPageFragment}
  
  query GetPolicyPages {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "type", value: ["vamc_system_policies_page"] }
      ]
    }) {
      entities {
        ... policiesPageFragment
      }
    }
  }
`;

module.exports = {
  fragment: policiesPageFragment,
  GetPolicyPages,
};
