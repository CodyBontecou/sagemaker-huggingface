import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { invokeSageMakerEndpoint } from './invokeSageMakerEndpoint'
import { config } from 'dotenv'

// Load environment variables
config()

const AWS_ENDPOINT_NAME = process.env.AWS_ENDPOINT_NAME
const AWS_REGION = process.env.AWS_REGION

if (!AWS_ENDPOINT_NAME || !AWS_REGION) {
    throw new Error('Missing required AWS configuration')
}

const CONTENT_DIR = join(process.cwd(), 'content')

const lang = {
    src: 'eng',
    tgt: 'spa',
}

async function handleTranslation(filePath: string): Promise<void> {
    try {
        // Read the file content
        const content = await readFile(filePath, 'utf-8')

        // Skip if it's already a Spanish translation
        if (filePath.includes('/spa/')) {
            return
        }

        // Get translation from SageMaker
        const response: [{ translation_text: string }] =
            await invokeSageMakerEndpoint(
                AWS_ENDPOINT_NAME,
                AWS_REGION,
                content,
                lang.src,
                lang.tgt
            )

        // Create the Spanish version path
        const relativePath = filePath.replace(CONTENT_DIR, '')
        const spanishPath = join(CONTENT_DIR, 'spa', relativePath)

        // Ensure the directory exists
        await mkdir(dirname(spanishPath), { recursive: true })

        // Write the translated content
        await writeFile(spanishPath, response[0].translation_text)

        console.log(`Translated ${relativePath} to Spanish`)
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error)
    }
}

async function* walkContent(dir: string): AsyncGenerator<string> {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const path = join(dir, entry.name)

        if (entry.isDirectory()) {
            // Skip the spa directory to avoid processing translations
            if (entry.name === 'spa') continue
            yield* walkContent(path)
        } else {
            // Only process content files
            if (entry.name.endsWith('.md') || entry.name.endsWith('.yaml')) {
                yield path
            }
        }
    }
}

async function main() {
    try {
        for await (const filePath of walkContent(CONTENT_DIR)) {
            await handleTranslation(filePath)
        }
        console.log('Translation completed successfully')
    } catch (error) {
        console.error('Translation failed:', error)
        process.exit(1)
    }
}

main()
