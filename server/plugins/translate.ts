import { invokeSageMakerEndpoint } from '../utils/invokeSageMakerEndpoint'
import { handleFileCreation } from '../utils/handleFileCreation'

export default defineNitroPlugin(async nitroApp => {
    const { AWS_ENDPOINT_NAME, AWS_REGION } = useRuntimeConfig()
    const lang = {
        src: 'eng',
        tgt: 'spa',
    }

    nitroApp.hooks.hook('content:file:beforeParse', async file => {
        const response: [{ translation_text: string }] =
            await invokeSageMakerEndpoint(
                AWS_ENDPOINT_NAME,
                AWS_REGION,
                file.body,
                lang.src,
                lang.tgt
            )

        if (!file._id.includes('content:spa:')) {
            handleFileCreation(file, response[0].translation_text, lang.tgt)
        }
    })
})
