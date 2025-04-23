/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google provider images
    },
    eslint: {
        ignoreDuringBuilds: ['/myproject']
    },

}

module.exports = nextConfig