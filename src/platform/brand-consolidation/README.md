# Brand-Consolidation
The Brand-Consolidation initiative is the migration of Vets.gov to VA.gov.

## Where it lives on GitHub
The work currently lives on the [`brand-consolidation` branch](https://github.com/department-of-veterans-affairs/vets-website/tree/brand-consolidation) of the `vets-website` repository. It was originally branched off of master.

## How to build VA.gov
To build the site, the build argument `--brand-consolidation-enabled` is passed to the build script (`script/build.js`). A shortcut for building the site in watch-mode is using `npm run watch:brand-consolidation`. Another useful command is to simply build the site, which will also run the Metalsmith link checker, `npm run build -- --brand-consolidation-enabled`. As URLs are mapped from the Vets.gov `content` directory to the new VA.gov `va-gov` directory and each instance of the former path (`href`) is updated to its new location, this command is crucial to run after any large URL changes.

## Environments
The brand-consolidated VA.gov site currently lives at the following locations:

- Dev: https://dev.va.gov
- Staging: https://staging.va.gov
- Production: https://preview.va.gov

Dev and Staging are built automatically when a change is merged into the `brand-consolidation` branch. Production has to be built manually, however, by running a Preview build in the Jenkins Deploy menu and passing the latest commit SHA of the `brand-consolidation` branch.

Even though it exists at the "preview" subdomain, the Production environment should be treated as any other production environment, as it is demoed and reviewed regularly.

## Review Instances
When issuing a pull request to `brand-consolidation`, if you prefix the name of your branch with `va-gov/`, the corresponding review instance for the pull request will be built using the `--brand-consolidation-enabled` to deploy it as a VA.gov site.

## Code Reviews
`brand-consolidation` is a protected branch, so a pull request must be issued and approved by another engineer. Because there were incompatible changes between `brand-consolidation` and `master`, along with the rapid development to meet changing requirements, automated tests were disabld so as a result you do not have the safety of those checks. We are working to merge `brand-consolidation` into `master` as soon as possible.

## Frontend Architecture and Feature Flag
The Metalsmith website currently exists in a separate directory, `va-gov/`. This is because the website layout has changed entirely, and the Vets.gov content has been mapped over to new locations for the brand-consolidated VA.gov. For this reason, we should not need access to the feature flag within Metalsmith. With that said, there may be some instances of checking a boolean named `mergedbuild` to render certain components. This was implemented presumably before the decision was made to create new Metalsmith components.

The Webpack code under the `src/` directory has access to the feature flag under `src/platform/feature-flag`. It can be consumed for conditional rendering like -

```
import isBrandConsolidationEnabled from '../../platform/brand-consolidation/feature-flag';

export default function  SomeComponent() {
    if (isBrandConsolidationEnabled())  return <h1>We are running on VA.gov</h1>
    return <h1>Vets.gov</h1>
}
```

There are also some minimal React helper components that abstract this:

```
import VetsDotGov from '../../platform/brand-consolidation/containers/VetsDotGov'
import BrandConsolidation  from ../../platform/brand-consolidation/containers/BrandConsolidation'

export default function  SomeComponent() {
    return (
        <div>
            <VetsDotGov>This is only rendered on Vets.gov</VetsDotGov>
            <BrandConsolidation>This is only rendered on VA.gov</BrandConsolidation>
        </div>
    );
}
```

Even though the Brand Consolidation work currently lives on its own branch, we should leverage that feature flag so as not to increase our technical debt for the eventual merge to `master`. If possible, we should write each change to be completely compatible with both branches.

## Zenhub
To filter to issues concerning FE engineers on the brand-consolidation project, filter using the `brand-consolidation`, `front end`, and possibly `Hydra` labels.

## Work Cycles
Similar to other teams, work is assigned at the beginning of each sprint based on organizational goals. As the team completes each ticket, it should be moved into the Validate column of the Zenhub board. Prior to the end of each sprint, we enter a scheduled Code Freeze. This term means that all work estimated for that sprint should be finished, reviewed, merged, and deployed to the Preview site. This will be coordinated between teams on the Monday prior to sprint ending so that all changes are published. This publish to Preview can be considered a handoff to the QA team, who will then verify each change and either close out the corresponding ticket, or assign bug tickets. These bug tickets will contain the labels `brand-consolidation`, `bug`,  and possibly `high priority` if that ticket must be completed ASAP. The following day we enter Code Complete, which is a final publish to the Preview site, this time containing all of the bug fixes completed over the past day. Most if not all of the bug fixes should be contained in this build. If not, we should use the corresponding ticket to document the reason it couldn't be completed.
