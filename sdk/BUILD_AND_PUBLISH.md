# Building and Publishing TrustJS SDK

## ⚠️ IMPORTANT: Build Before Publishing

The SDK **MUST** be built before publishing to npm. The source code in `src/` needs to be compiled into the `dist/` directory.

## 🔨 Build Process

### 1. Install Dependencies

```bash
cd sdk
npm install
```

### 2. Build the SDK

```bash
npm run build
```

This will:
- Compile source code from `src/` to `dist/`
- Create 3 bundle formats:
  - `dist/trustjs.cjs.js` - CommonJS (for Node.js)
  - `dist/trustjs.esm.js` - ES Module (for modern bundlers)
  - `dist/trustjs.umd.js` - UMD (for browsers)
- Extract CSS to `dist/trustjs.css`
- Generate TypeScript definitions in `dist/`

### 3. Verify Build

Check that the `dist/` directory contains:

```bash
ls -la dist/
```

You should see:
- `trustjs.cjs.js`
- `trustjs.esm.js`
- `trustjs.umd.js`
- `trustjs.css`
- `index.d.ts`
- Source maps (`.map` files)

## 📦 Publishing to npm

### 1. Login to npm

```bash
npm login
```

### 2. Test the Package Locally

```bash
# See what will be published
npm pack --dry-run

# Create a tarball to test
npm pack
```

### 3. Publish

```bash
npm publish
```

The `prepublishOnly` script will automatically run `npm run build` before publishing.

## 🔄 Update Workflow

When making changes:

```bash
# 1. Make your changes in src/
# 2. Build
npm run build

# 3. Test locally
npm pack
npm install ./trust-mfa-sdk-1.1.0.tgz

# 4. Update version
npm version patch  # or minor, or major

# 5. Publish
npm publish
```

## 🐛 Troubleshooting

### "Module not found" errors

**Problem**: The `dist/` directory is missing or incomplete.

**Solution**: Run `npm run build` before publishing.

### "Cannot find module '@rollup/plugin-babel'"

**Problem**: Dev dependencies not installed.

**Solution**:
```bash
npm install
```

### Build fails

**Problem**: Missing dependencies or configuration issues.

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📋 Pre-Publish Checklist

- [ ] All changes committed to git
- [ ] `npm run build` completes successfully
- [ ] `dist/` directory contains all files
- [ ] `npm pack --dry-run` shows correct files
- [ ] Version number updated in `package.json`
- [ ] README.md is up to date
- [ ] CHANGELOG.md updated (if you have one)
- [ ] Tested locally with `npm pack`

## 🎯 What Gets Published

Only these files/directories are published (defined in `package.json` "files"):

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

The `src/` directory and other development files are **NOT** published.

## 🚀 Quick Publish Command

```bash
# One command to build and publish
npm run build && npm publish
```

---

**Remember**: Always build before publishing! The `prepublishOnly` script helps, but it's good practice to build and test first.
