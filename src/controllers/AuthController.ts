import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // prevenir duplicados
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        res.status(409).json({ error: error.message });
        return;
      }

      // crea un usuario
      const user = new User(req.body);

      user.password = await hashPassword(password);

      // generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("cuenta creada, revisa tu mail para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no valido");
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "la cuenta no ha sido confirmada, se ha enviado un correo de confirmacion"
        );
        res.status(401).json({ error: error.message });
        return;
      }

      // revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("password incorrecto");
        res.status(401).json({ error: error.message });
        return;
      }
      const token = generateJWT({ id: user.id });
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).json({ error: error.message });
        return;
      }
      if (user.confirmed) {
        const error = new Error("El usuario ya esta confirmado");
        res.status(409).json({ error: error.message });
        return;
      }

      // generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("se envio un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu mail para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no valido");
        res.status(404).json({ error: error.message });
        return;
      }

      res.send("Token valido define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no valido");
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(req.body.password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("El password se cambio correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
    return;
  };

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error("Ese email ya esta registrado");
      res.status(409).json({ error: error.message });
      return;
    }
    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamemnte");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }

    return;
  };
  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await checkPassword(current_password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("El password actual es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("el password se modifico correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };
  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("El password  es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }
    res.send("el password es correcto");
  };
}
