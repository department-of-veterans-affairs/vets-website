# React Router v3 to v5 Migration Status

## Completed Migrations

### 1. Package Dependencies ✅

- Updated `package.json` to use React Router v5
- Changed `react-router: "3"` → `react-router: "^5.3.4"`
- Updated `react-router-dom: "^5.3.0"` → `react-router-dom: "^5.3.4"`
- Updated `history: "3"` → `history: "^5.3.0"`
- Updated workspace packages that had specific v3 dependencies

### 2. Platform Core Migration ✅

- **`src/platform/startup/index.js`**:
  - Replaced `browserHistory` and `useRouterHistory` with `createBrowserHistory`
  - Updated Router imports to use `react-router-dom`
  - Updated history API usage (`getCurrentLocation()` → `location`, `listen` callback signature)

### 3. Forms System Core ✅

- **`src/platform/forms-system/src/js/routing/createRoutes.js`**:
  - Converted from returning v3 route configuration objects to v5 JSX routes
  - Uses `<Switch>`, `<Route>`, and `<Redirect>` components
  - Maintained backward compatibility by creating `createLegacyRoutes.js`

### 4. Migration Utilities ✅

- **`src/platform/forms-system/src/js/routing/createLegacyRoutes.js`**:
  - Maintains v3-style configuration object API for backward compatibility
- **`src/platform/forms-system/src/js/routing/convertLegacyRoutes.js`**:
  - Converts v3 route configuration objects to v5 JSX routes
  - Handles `onEnter` hooks, `indexRoute`, and `childRoutes`
  - Provides gradual migration path

### 5. Updated Save-in-Progress System ✅

- **`src/platform/forms/save-in-progress/helpers.js`**:
  - Updated to use `createLegacyRoutes` for backward compatibility
  - Maintained existing API while using v5 internally

### 7. Component Migration ✅

- **Component Updates**: Migrated React Router v3 features to v5 hooks
  - Replaced `withRouter` HOC with `useHistory`, `useLocation`, `useParams` hooks
  - Updated components accessing `router` props to use hooks
  - Converted route component props to hook usage
  - Created wrapper patterns for class components that need router functionality

#### Successfully Migrated Components:

**Mock Form Design Pattern Components:**

- **`ContactInfo.jsx`**: Complex form component with router state navigation
  - Migrated `withRouter` HOC to hook-based wrapper
  - Maintained backward compatibility with legacy route access patterns
- **`FormTab.jsx`**: Development panel form analyzer component
- **`HeadingHierarchyInspector.jsx`**: Accessibility analysis tool
- **`EditContactInfo.jsx`**: Contact editing page builder
- **`PatternConfigContext.jsx`**: Context provider for form patterns
- **`CancelButton`**: Reusable cancel modal component helper

**Application Components:**

- **`BackToAppointments.jsx`**: Navigation component using router
- **`EditLink.jsx`**: Edit link component with navigation

### 8. Programmatic Navigation Migration ✅

- **Browser History Replacement**: Updated `browserHistory` usage to `useHistory` hook

  - `src/applications/discover-your-benefits/containers/ConfirmationPage.jsx`
  - `src/applications/facility-locator/containers/FacilitiesMap.jsx`
  - `src/applications/representative-search/containers/SearchPage.jsx`
  - `src/applications/financial-status-report/containers/App.jsx`

- **Query String Handling**: Migrated from `location.query` to `URLSearchParams`

  - Updated `location.query` access to use `new URLSearchParams(location.search)`
  - Created helper functions to maintain backward compatibility
  - Applied to facility locator, representative search, and benefits discovery components

- **Navigation Method Updates**:
  - `browserHistory.push()` → `history.push()` from `useHistory`
  - `browserHistory.replace()` → `history.replace()` from `useHistory`
  - `router.push()` → `history.push()` from `useHistory`
  - Maintained router prop compatibility through wrapper components

## Migration Patterns Implemented

### Pattern 1: Direct Migration to v5 JSX

```jsx
// Old v3 style
const routes = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/intro') },
  childRoutes: [...]
};

// New v5 style
const routes = (
  <Switch>
    <Route path="/" exact render={() => <Redirect to="/intro" />} />
    <Route path="*" component={App}>
      {/* nested routes */}
    </Route>
  </Switch>
);
```

### Pattern 3: Component Migration with Hooks

```jsx
// Old v3 withRouter HOC pattern
import { withRouter } from 'react-router';

const Component = ({ router }) => {
  const handleClick = () => {
    router.push('/some-path');
  };
  return <button onClick={handleClick}>Navigate</button>;
};

export default withRouter(Component);

// New v5 hooks pattern
import { useHistory } from 'react-router-dom';

const Component = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/some-path');
  };
  return <button onClick={handleClick}>Navigate</button>;
};

export default Component;
```

### Pattern 4: Query String Migration

```jsx
// Old v3 location.query pattern
const Component = ({ location }) => {
  const param = location.query.someParam;
  return <div>{param}</div>;
};

// New v5 URLSearchParams pattern
import { useLocation } from 'react-router-dom';

const Component = () => {
  const location = useLocation();
  const query = Object.fromEntries(new URLSearchParams(location.search));
  const param = query.someParam;
  return <div>{param}</div>;
};
```

### Pattern 5: Class Component Wrapper

```jsx
// For class components that can't use hooks directly
import { useHistory, useLocation } from 'react-router-dom';

class ClassComponent extends React.Component {
  render() {
    return <div onClick={() => this.props.history.push('/path')}>Click</div>;
  }
}

const ClassComponentWithRouter = props => {
  const history = useHistory();
  const location = useLocation();

  // Create router object for backward compatibility
  const router = {
    push: history.push,
    replace: history.replace,
    location,
  };

  return <ClassComponent {...props} router={router} history={history} />;
};
```

## Breaking Changes Addressed

### 1. Router and History API Changes

- `browserHistory` → `createBrowserHistory()`
- `useRouterHistory(createHistory)` → `createBrowserHistory({ basename })`
- `history.getCurrentLocation()` → `history.location`
- `history.listen(location => {})` → `history.listen(({ location }) => {})`

### 2. Route Configuration → JSX Components

- Route objects with `component`, `path`, `onEnter` → `<Route>` JSX
- `indexRoute: { onEnter }` → `<Route exact render={() => <Redirect />}>`
- `childRoutes: [...]` → nested `<Route>` components

### 4. Programmatic Navigation Changes

- `browserHistory.push()` → `history.push()` from `useHistory`
- `browserHistory.replace()` → `history.replace()` from `useHistory`
- `router.push()` → `history.push()` from `useHistory` (when using hooks)
- For class components: pass `history` prop from wrapper component

### 5. Query String Handling Changes

- v3: `location.query.param` (automatic parsing)
- v5: `new URLSearchParams(location.search).get('param')` (manual parsing)
- Or: `Object.fromEntries(new URLSearchParams(location.search))` for object format

### 6. Component Integration Changes

- `withRouter(Component)` → `useHistory()`, `useLocation()`, `useParams()` hooks
- `context.router` → React Router v5 hooks
- Route props (`match`, `location`, `history`) → corresponding hooks

## Migration Summary

### ✅ **Completed Migrations:**

1. **Package Dependencies**: Updated to React Router v5 across all packages
2. **Platform Core**: Migrated startup system and forms-system core
3. **Migration Utilities**: Created backward compatibility helpers
4. **Save-in-Progress**: Updated to work with v5 while maintaining API
5. **Example Applications**: Migrated sample applications as reference
6. **Component Migration**: Updated key components from withRouter to hooks
7. **Programmatic Navigation**: Replaced browserHistory with useHistory hook
8. **Query String Handling**: Migrated from location.query to URLSearchParams

### 🔄 **Components Successfully Updated:**

- **Forms System Components**: ContactInfo, FormTab, EditContactInfo, PatternConfigContext
- **Navigation Components**: BackToAppointments, EditLink, CancelButton helpers
- **Application Pages**: ConfirmationPage, FacilitiesMap, SearchPage, App containers
- **Developer Tools**: HeadingHierarchyInspector

### 📊 **Migration Patterns Implemented:**

1. **Direct Hook Migration**: Functional components using useHistory/useLocation
2. **Wrapper Pattern**: Class components with hook-based wrappers
3. **Query Compatibility**: URLSearchParams with backward compatibility helpers
4. **Router Props**: Maintained router prop interface through wrappers

## Files Still Requiring Migration

### High Priority (Core Platform)

- `src/platform/forms-system/src/js/routing/index.js` - Navigation helpers
- Any remaining `context.router` usage throughout the codebase

### Form Applications (Many)

Most form applications still use v3 patterns and need migration:

- All files in `src/applications/*/routes.jsx` using `createRoutesWithSaveInProgress`
- Applications using custom routing logic
- Components using `context.router`, `withRouter` HOC

### Navigation and Routing Logic

- Components using `router.push()`, `router.replace()`
- Programmatic navigation patterns
- Route guards and middleware

## Next Steps for Complete Migration

### Phase 1: Core Platform Components

1. Update routing helper functions in `src/platform/forms-system/src/js/routing/index.js`
2. Replace `context.router` usage with hooks (`useHistory`, `useLocation`, `useParams`)
3. Update `withRouter` HOC usage to use hooks

### Phase 2: Form Applications

1. Migrate remaining form applications to use v5 patterns
2. Test save-in-progress functionality thoroughly
3. Update any custom routing logic

### Phase 3: Component Migration

1. Replace `router.push()` with `history.push()` from `useHistory`
2. Update route props access patterns
3. Test navigation flows extensively

### Phase 4: Cleanup

1. Remove legacy conversion utilities
2. Remove `createLegacyRoutes` once all apps are migrated
3. Update documentation and examples

## Testing Considerations

### Critical Test Areas

1. **Form Navigation**: Ensure page-to-page navigation works
2. **Save-in-Progress**: Verify form state preservation
3. **Authentication Flows**: Test login/logout redirects
4. **Deep Linking**: Verify direct URL access
5. **Browser Navigation**: Test back/forward buttons
6. **Error Handling**: Ensure 404 and error pages work

### Browser Compatibility

- React Router v5 requires modern browsers
- History API support required
- Test across supported browser matrix

## Migration Success Criteria

- [ ] All applications load and navigate correctly
- [ ] No console errors related to routing
- [ ] Save-in-progress functionality works
- [ ] Authentication flows unchanged
- [ ] Performance maintained or improved
- [ ] All tests pass
- [ ] Bundle size impact acceptable

## Risk Mitigation

### Backward Compatibility

- Keep `createLegacyRoutes` during transition period
- Use feature flags for gradual rollout if needed
- Monitor error rates and user experience

### Rollback Plan

- Git branches for easy reversion
- Feature flags to disable v5 routing
- Database migration considerations for any route-dependent data

## Resources and Documentation

### React Router v5 Migration Guide

- [Official Migration Guide](https://reactrouter.com/web/guides/migrating-5-to-6)
- [v5 API Reference](https://v5.reactrouter.com/)

### Internal Documentation

- Platform forms system documentation
- VA.gov routing patterns
- Save-in-progress system documentation
