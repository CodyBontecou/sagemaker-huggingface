import { promises as fs } from 'fs'
import path from 'path'

interface ContentObject {
    _id: string
    body: string
}

interface ProcessResult {
    originalId: string
    writtenTo: string
}

export async function handleFileCreation(
    contentObj: ContentObject,
    translatedText: string,
    languageDirectory: string
): Promise<ProcessResult> {
    // Remove 'content:' prefix
    if (!contentObj._id.startsWith('content:')) {
        throw new Error('Content object ID must start with "content:"')
    }

    // Split remaining path and remove empty parts
    const parts = contentObj._id.slice(8).split(':').filter(Boolean)

    if (parts.length === 0) {
        throw new Error('Invalid content object ID format')
    }

    // Construct the full file path by joining all parts
    const filePath = path.join('content', languageDirectory, ...parts)
    console.log(filePath)

    // Create directory if it doesn't exist
    const dirPath = path.dirname(filePath)
    await fs.mkdir(dirPath, { recursive: true })

    // Write the content to the file
    await fs.writeFile(filePath, translatedText, 'utf-8')

    return {
        originalId: contentObj._id,
        writtenTo: filePath,
    }
}
