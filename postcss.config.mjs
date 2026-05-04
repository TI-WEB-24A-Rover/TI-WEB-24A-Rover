import path from "path";

const workspaceRoot = path.resolve(process.cwd(), "..");

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: workspaceRoot,
    },
  },
};

export default config;
