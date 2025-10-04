# Publishing TrustJS SDK to npm

## Prerequisites

1. **Create an npm account** (if you don't have one)
   - Go to https://www.npmjs.com/signup
   - Create your account

2. **Install Node.js and npm**
   ```bash
   node --version  # Should be v14 or higher
   npm --version   # Should be v6 or higher
   ```

## Step-by-Step Publishing Guide

### 1. Login to npm

```bash
npm login
```

Enter your npm credentials:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

### 2. Navigate to SDK Directory

```bash
cd sdk
```

### 3. Verify Package Configuration

Check that your `package.json` is correct:

```bash
cat package.json
```

Make sure:
- ✅ Package name is unique (check on npmjs.com)
- ✅ Version is correct (start with 1.0.0)
- ✅ Main file points to `trust-mfa-sdk.js`
- ✅ All required fields are filled

### 4. Test Your Package Locally (Optional)

```bash
# Create a test directory
mkdir ../test-sdk
cd ../test-sdk
npm init -y

# Install your local package
npm install ../sdk

# Test it
node -e "const TrustMFA = require('trust-mfa-sdk'); console.log(TrustMFA);"
```

### 5. Check Package Contents

See what will be published:

```bash
cd ../sdk
npm pack --dry-run
```

This shows all files that will be included in the package.

### 6. Publish to npm

**For first-time publish:**

```bash
npm publish
```

**If the package name is already taken, you can publish under a scope:**

```bash
# Update package.json name to "@your-username/trust-mfa-sdk"
npm publish --access public
```

### 7. Verify Publication

Check your package on npm:

```bash
npm view trust-mfa-sdk
```

Or visit: https://www.npmjs.com/package/trust-mfa-sdk

### 8. Test Installation

In a new directory:

```bash
npm install trust-mfa-sdk
```

## Updating Your Package

### 1. Make Changes to Your Code

Edit `trust-mfa-sdk.js` or other files as needed.

### 2. Update Version Number

Follow semantic versioning (semver):

```bash
# For bug fixes (1.0.0 -> 1.0.1)
npm version patch

# For new features (1.0.0 -> 1.1.0)
npm version minor

# For breaking changes (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publish Update

```bash
npm publish
```

## Common Issues and Solutions

### Issue: Package name already exists

**Solution:** Use a scoped package name

```json
{
  "name": "@your-username/trust-mfa-sdk"
}
```

Then publish with:
```bash
npm publish --access public
```

### Issue: Authentication failed

**Solution:** Re-login to npm

```bash
npm logout
npm login
```

### Issue: 403 Forbidden

**Solution:** Check if you have permission to publish

```bash
npm owner ls trust-mfa-sdk
npm owner add your-username trust-mfa-sdk
```

### Issue: Files missing from package

**Solution:** Check `.npmignore` and `package.json` files array

```json
{
  "files": [
    "trust-mfa-sdk.js",
    "trust-mfa-sdk.d.ts",
    "README.md",
    "LICENSE"
  ]
}
```

## Best Practices

1. **Always test locally before publishing**
   ```bash
   npm pack
   npm install ./trust-mfa-sdk-1.0.0.tgz
   ```

2. **Use semantic versioning**
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes

3. **Keep README.md updated**
   - Clear installation instructions
   - Usage examples
   - API documentation

4. **Add a CHANGELOG.md**
   - Document all changes between versions

5. **Use npm tags for pre-releases**
   ```bash
   npm publish --tag beta
   npm publish --tag next
   ```

6. **Enable 2FA for security**
   ```bash
   npm profile enable-2fa auth-and-writes
   ```

## Quick Reference Commands

```bash
# Login
npm login

# Check who you're logged in as
npm whoami

# Publish package
npm publish

# Update version
npm version patch|minor|major

# View package info
npm view trust-mfa-sdk

# Unpublish (within 72 hours)
npm unpublish trust-mfa-sdk@1.0.0

# Deprecate a version
npm deprecate trust-mfa-sdk@1.0.0 "Use version 1.0.1 instead"
```

## After Publishing

1. **Update your documentation** with the correct npm install command
2. **Create a GitHub release** matching your npm version
3. **Announce on social media** or relevant communities
4. **Monitor issues** on GitHub and npm

## Support

- npm documentation: https://docs.npmjs.com/
- Semantic versioning: https://semver.org/
- npm support: https://www.npmjs.com/support

---

**TrustJS - Trust is the only way.**
