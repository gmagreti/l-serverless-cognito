import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { cognitoClient } from '@/utils/cognito-client';
import { response } from '@/utils/response';

export async function handler(event:  APIGatewayProxyEventV2WithJWTAuthorizer) {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  const command = new AdminGetUserCommand({
    Username: userId,
    UserPoolId: process.env.COGNITO_POOL_ID,
  });

  const { UserAttributes } = await cognitoClient.send(command);

  const profile = UserAttributes?.reduce((profileObj, { Name, Value }) => {
    const keyMap = {
      sub: 'id',
      given_name: 'firstName',
      family_name: 'lastName',
    };

    return {
      ...profileObj,
      [keyMap[Name as keyof typeof keyMap] ?? Name]: Value
    };
  }, {} as any);

  return response(200, { profile });
}
