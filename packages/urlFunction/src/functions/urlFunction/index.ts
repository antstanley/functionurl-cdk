import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

async function handler (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  return {
    statusCode: 200,
    body: `echo event body ${event.body}`
  }
}

export { handler }
