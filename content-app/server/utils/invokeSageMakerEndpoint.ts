import {
    SageMakerRuntimeClient,
    InvokeEndpointCommand,
} from '@aws-sdk/client-sagemaker-runtime'

export async function invokeSageMakerEndpoint(
    endpointName: string,
    region: string,
    inputText: string,
    srcLang: string,
    tgtLang: string
) {
    // Initialize the SageMaker Runtime Client
    const client = new SageMakerRuntimeClient({ region })

    // Create the command to invoke the endpoint
    const command = new InvokeEndpointCommand({
        ContentType: 'application/json',
        EndpointName: endpointName,
        Body: JSON.stringify({
            inputs: inputText,
            // These parameter's are specific to the model we are using
            parameters: {
                src_lang: srcLang,
                tgt_lang: tgtLang,
            },
        }),
    })

    // Send the command and get the response
    const response = await client.send(command)
    // TODO: Do I need the decoder, or can I just parse the response.body?
    const decodedResponse = JSON.parse(new TextDecoder().decode(response.Body))

    return decodedResponse
}
