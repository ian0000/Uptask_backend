import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Confirma tu cuenta",
      text: "Uptask - Confirma tu cuenta",
      html: `<p>Hola ${user.name}, has creado ty cuenta en UpTask, ya casi esta todo listo solo debes configurar tu cuenta</p>
      <p>visita el siguente enlace</p>
      <a href="${process.env.FRONTEND_URL}/auth/confirm-account">confirmar cuenta</a>
      <p>E ingresa el siguiente codigo: <b>${user.token}</b> El token expirara en 10 mins</p>
      
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Restablece tu password",
      text: "Uptask - Restablece tu password",
      html: `<p>Hola ${user.name}, has solicitado restablecer tu password.</p>
      <a href="${process.env.FRONTEND_URL}/auth/new-password"> Restablecer password</a>
      <p>E ingresa el siguiente codigo: <b>${user.token}</b> El token expirara en 10 mins</p>
      
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
