module.exports = {
  hooks: {
    readPackage(pkg) {
      // Apply patches using the new pnpm format
      if (pkg.name === 'wouter' && pkg.version.startsWith('3.7.1')) {
        // This tells pnpm to apply the patch
        if (!pkg.pnpm) {
          pkg.pnpm = {};
        }
      }
      return pkg;
    },
  },
};
