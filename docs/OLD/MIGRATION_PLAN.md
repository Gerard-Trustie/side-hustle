# Migration Plan: Next.js 15 → 14.x for Hustle Hub

## 🎯 Overview
Downgrade `apps/hustle-hub` from Next.js 15.3.2 to 14.2.14 to align with `apps/admin-app`.

**Status**: ✅ Package.json updated, ready for dependency installation

## 📊 Migration Impact Assessment

### ✅ Low Risk Items (Already Compatible)
- **App Router**: Basic usage compatible with Next.js 14
- **Image Component**: Standard Next.js Image component usage
- **Metadata API**: Standard metadata export
- **Font Optimization**: Geist fonts work with Next.js 14
- **CSS Modules**: Standard CSS module usage
- **TypeScript**: Compatible versions selected

### ⚠️ Items to Verify After Migration
- **ESLint Configuration**: Downgraded from v9 to v8
- **React Types**: Downgraded from v19 to v18
- **Build Process**: Verify no breaking changes

## 🔧 Migration Steps

### Step 1: ✅ Update Dependencies (COMPLETED)
Package.json has been updated with:
- Next.js: `15.3.2` → `14.2.14`
- React: `^19.0.0` → `^18`
- React DOM: `^19.0.0` → `^18`
- TypeScript: `^5` → `^5.3.2`
- ESLint: `^9` → `^8`
- ESLint Config Next: `15.3.2` → `14.0.2`
- React Types: `^19` → `^18`

### Step 2: Install Updated Dependencies

```bash
# Navigate to hustle-hub
cd apps/hustle-hub

# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies with exact versions
npm install

# Return to root and reinstall all workspace dependencies
cd ../..
npm install
```

### Step 3: Code Compatibility Check

Run this checklist after dependency installation:

```bash
# Check for TypeScript compilation errors
cd apps/hustle-hub
npx tsc --noEmit

# Check for linting issues
npm run lint

# Test development server
npm run dev
```

### Step 4: Verify Build Process

```bash
# Test production build
npm run build

# Test production start
npm run start
```

### Step 5: Integration Testing

```bash
# Test both apps simultaneously
# Terminal 1:
npm run dev:admin

# Terminal 2:
npm run dev:hustle-hub

# Verify both apps start without conflicts
```

## 🔍 Potential Issues & Solutions

### Issue 1: ESLint Configuration Conflicts
**Problem**: ESLint v8 vs v9 differences
**Solution**: 
```bash
# If ESLint errors occur, update .eslintrc.json:
{
  "extends": ["next/core-web-vitals"]
}
```

### Issue 2: React Types Mismatch
**Problem**: Some React 19 specific types may not exist in React 18
**Solution**: Check `layout.tsx` and `page.tsx` for any React 19 specific types

### Issue 3: Font Loading Issues
**Problem**: Geist fonts might have different loading behavior
**Solution**: Already using standard Next.js font loading, should be compatible

## 🧪 Testing Checklist

### Functional Testing
- [ ] App starts in development mode
- [ ] App builds for production
- [ ] Hot reload works correctly
- [ ] Images load properly
- [ ] Fonts render correctly
- [ ] CSS styles apply correctly
- [ ] TypeScript compilation passes
- [ ] ESLint passes without errors

### Integration Testing
- [ ] Both apps can run simultaneously
- [ ] Shared packages work with both Next.js versions
- [ ] No port conflicts
- [ ] Both apps build successfully

## 🚀 Post-Migration Tasks

### 1. Update Documentation
- [x] Update README.md (already reflects Next.js 14 for both apps)
- [ ] Update any API documentation if needed

### 2. Update CI/CD
- [ ] Ensure build pipelines work with Next.js 14
- [ ] Update any version-specific build configurations

### 3. Team Communication
- [ ] Notify team of the version alignment
- [ ] Update development setup instructions if needed

## 🔄 Rollback Plan

If issues arise, rollback steps:

```bash
# Restore original package.json
git checkout HEAD -- apps/hustle-hub/package.json

# Restore dependencies
cd apps/hustle-hub
rm -rf node_modules package-lock.json
npm install

# Return to root
cd ../..
npm install
```

## 📋 Success Criteria

Migration is successful when:
- [ ] Hustle-hub runs on Next.js 14.2.14
- [ ] All existing functionality works
- [ ] Both apps use the same Next.js major version
- [ ] No breaking changes in development workflow
- [ ] Production builds work correctly
- [ ] Shared packages remain compatible

## 🎉 Benefits After Migration

1. **Version Consistency**: Both apps on same Next.js major version
2. **Easier Maintenance**: Single set of Next.js docs and patterns
3. **Reduced Complexity**: Simpler dependency management
4. **Better Stability**: Next.js 14 is more battle-tested
5. **Team Efficiency**: Consistent development experience

---

**Next Steps**: Run Step 2 (Install Updated Dependencies) to continue the migration. 
