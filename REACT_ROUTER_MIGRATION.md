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

### 6. Example Application Migrations ✅
- **`src/applications/hca/routes.jsx`**: Migrated using conversion utility
- **`src/applications/representative-form-upload/routes.jsx`**: Direct v5 migration

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

### Pattern 2: Gradual Migration with Conversion Utility
```jsx
// Migration helper approach
import { createV5RoutesFromLegacy } from 'platform/forms-system/src/js/routing/convertLegacyRoutes';

const legacyRoutes = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/intro') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

const routes = createV5RoutesFromLegacy(legacyRoutes);
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

### 3. onEnter Lifecycle Hook
- v3: `onEnter: (nextState, replace) => replace('/path')`
- v5: `<Route render={() => <Redirect to="/path" />}>`
- Or: Handle in component with `useEffect` + `useHistory`

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
