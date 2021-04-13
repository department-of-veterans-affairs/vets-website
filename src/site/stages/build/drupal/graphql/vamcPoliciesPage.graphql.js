const policiesPageFragment = `
  fragment policiesPageFragment on NodeVamcSystemPoliciesPage {
    title
    status
    entityBundle
    entityUrl {
      path
    }    
    fieldCcIntroText {
      fetched
      fetchedBundle
    }
    fieldCcTopOfPageContent {
      fetched
      fetchedBundle    
    }
    fieldVamcVisitationPolicy {
      processed
    }
    fieldVamcOtherPolicies {
      processed
    }
    fieldCcGenVisitationPolicy {
      fetched
      fetchedBundle        
    }
    fieldCcBottomOfPageContent {
      fetched
      fetchedBundle        
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
