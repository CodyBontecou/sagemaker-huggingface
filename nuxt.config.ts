export default defineNuxtConfig({
    modules: ['@nuxt/content', '@nuxtjs/i18n'],

    runtimeConfig: {
        AWS_ENDPOINT_NAME: process.env.AWS_ENDPOINT_NAME,
        AWS_REGION: process.env.AWS_REGION,
    },

    compatibilityDate: '2025-01-14',
    nitro: {
        preset: 'vercel',
    },
})
