import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'
import fetch from 'node-fetch'

export const signedRequest = async <Response>(
  url: string,
  method: string,
  body?: unknown
): Promise<object> => {
  const apiUrl = new URL(url)

  const sigv4 = new SignatureV4({
    service: 'lambda',
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      sessionToken: process.env.AWS_SESSION_TOKEN!
    },
    sha256: Sha256
  })

  return sigv4.sign({
    method: method.toUpperCase(),
    hostname: apiUrl.host,
    path: apiUrl.pathname,
    protocol: apiUrl.protocol,
    headers: {
      'Content-Type': 'text/html',
      host: apiUrl.hostname // compulsory
    },
    body: JSON.stringify(body)
  })
}

async function handler (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const url = process.env.INVOKE_URL!
  const method = 'POST'

  const signedPayload = await signedRequest(url, method, event.body)

  const request = await fetch(url, signedPayload)

  const response = await request.text()
  return { statusCode: 200, body: response }
}

export { handler }
