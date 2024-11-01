import type { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === 'CustomMessage_SignUp') {
    const name = event.request.userAttributes.given_name;
    const code = event.request.codeParameter;

    event.response.emailSubject = `Bem-vindo, ${name}!`;
    event.response.emailMessage = `Olá, ${name}! Obrigado por se cadastrar em nossa plataforma! <br /> Seu código de verificação é: ${code}`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const code = event.request.codeParameter;
    const email = event.request.userAttributes.email;

    event.response.emailSubject = 'Recuperação de senha';
    event.response.emailMessage = `Olá! <br /> Seu código de verificação é: ${code} <br />
    acesse: <strong>https://app.seuapp.com.br/reset/?email=${encodeURIComponent(
    email,
  )}&code=${code}</strong>
    `;
  }

  return event;
}
