import { InitiateAuthCommand, NotAuthorizedException, UserNotConfirmedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { bodyParser } from '@/utils/body-parser';
import { cognitoClient } from '@/utils/cognito-client';
import { response } from '@/utils/response';

export async function handler(event:  APIGatewayProxyEventV2) {
  try {
    const { email, password } = bodyParser(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if(!AuthenticationResult) {
      return response(401, {
        error: 'Invalid credentials'
      });
    }

    return response(201, {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    if(error instanceof UserNotFoundException) {
      return response(401, {
        message: 'Invalid credentials'
      });
    }

    if(error instanceof UserNotConfirmedException) {
      return response(401, {
        message: 'You need to confirm your account before sign in'
      });
    }

    if(error instanceof NotAuthorizedException) {
      return response(401, {
        message: 'Invalid credentials'
      });
    }

    return response(500, {
      message: 'Internal server error'
    });
  }
}
