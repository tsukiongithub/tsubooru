// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		// https://img3.gelbooru.com/8c/46/8c4652fa86d6729512f6e5931fc5fd48.jpeg
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.gelbooru.com",
				pathname: "/**",
			},
		],
		unoptimized: true,
	},
};
export default config;
