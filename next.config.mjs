import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  sassOptions: {
    // Lets every module write `@use "mixins" as *;`
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
