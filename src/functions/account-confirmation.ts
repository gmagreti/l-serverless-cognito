import { bodyParser } from '@/utils/body-parser';
import { cognitoClient } from '@/utils/cognito-client';
import { response } from '@/utils/response';
import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event:  APIGatewayProxyEventV2) {
  try {
    const { email, code } = bodyParser(event.body);

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,

    });

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    return response(500, {
      message: 'Internal server error'
    });
  }
}
