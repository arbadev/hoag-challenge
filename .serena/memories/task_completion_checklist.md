# Task Completion Checklist

When completing any coding task in this project, ensure you:

## 1. Code Quality
- [ ] TypeScript types are properly defined (no `any` types unless absolutely necessary)
- [ ] Components follow established patterns (functional components, named exports)
- [ ] Props interfaces are properly defined
- [ ] File naming follows kebab-case convention
- [ ] Component naming follows PascalCase convention

## 2. Type Checking
```bash
pnpm typecheck
# or
npm run typecheck
```
Ensure no TypeScript errors are present

## 3. Manual Testing
- [ ] Test the feature in development mode (`pnpm dev`)
- [ ] Verify responsive behavior on different screen sizes
- [ ] Test both agent and admin role perspectives if applicable
- [ ] Check for console errors in browser developer tools

## 4. Code Organization
- [ ] New components placed in appropriate directories
- [ ] Imports use the `~` alias where applicable
- [ ] Related components grouped together
- [ ] Utility functions extracted to `lib/` directory

## 5. State Management
- [ ] Context updates don't cause unnecessary re-renders
- [ ] Local storage integration works correctly
- [ ] Loading states implemented where needed
- [ ] Error states handled appropriately

## 6. UI/UX Considerations
- [ ] Toast notifications added for user actions
- [ ] Loading skeletons implemented for async operations
- [ ] Keyboard navigation works correctly
- [ ] ARIA labels added for accessibility

## Note on Testing & Linting
Currently, this project does not have:
- ESLint configuration
- Prettier configuration  
- Jest or other testing frameworks

Manual testing and TypeScript type checking are the primary quality assurance methods.