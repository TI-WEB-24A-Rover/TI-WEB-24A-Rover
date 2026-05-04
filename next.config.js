const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
};

module.exports = nextConfig;