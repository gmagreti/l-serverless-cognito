import { bodyParser } from '@/utils/body-parser';
import { cognitoClient } from '@/utils/cognito-client';
import { response } from '@/utils/response';
import { SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event:  APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        { Name: 'given_name', Value: body.firstName },
        { Name: 'family_name', Value: body.lastName },
      ],
    });

    const { UserSub } = await cognitoClient.send(command);

    return response(201, {
      user: {
        id: UserSub
      }
    });
  } catch (error) {
    if(error instanceof UsernameExistsException) {
      return response(409, {
        message: 'Username already exists'
      });
    }

    return response(500, {
      message: 'Internal server error'
    });
  }
}
