/**
 * The properties for the Router React component
 *
 * @beta
 */
export interface RouterProps {
  children: Routable | Array<Routable>;
  basename: string;
}

/**
 * Indicates if a component can be routed using `react-router-dom`. The `path`
 * prop must be present.
 *
 * @beta
 */
export interface Routable {
  path: string;
}

/**
 * The properties for the Page React component
 *
 * @beta
 */
export interface PageProps {
  children: JSX.Element[];
  title: string;
  path: string;
}
