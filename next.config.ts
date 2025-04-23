/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google provider images
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com', // Vercel Storage
            },
            // Add other allowed domains if needed
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '4mb', // Set your desired limit (default is 1MB)
        },
    },
}

module.exports = nextConfig
