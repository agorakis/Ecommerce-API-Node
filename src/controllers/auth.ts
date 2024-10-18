import { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { LoginSchema, SingUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (req: Request, res: Response) => {
  SingUpSchema.shape.body.parse(req.body);
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });

  if (user) {
    throw new BadRequestsException(
      "User already exist!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prismaClient.user.create({
    data: { name: name, email: email, password: hashSync(password, 10) },
  });
  res.send(user);
};

export const login = async (req: Request, res: Response) => {
  LoginSchema.shape.body.parse(req.body);

  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });

  if (!user) {
    throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "Incorrect Password!",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.send({ user, token });
};

export const me = async (req: Request, res: Response) => {
  res.send(req?.body?.user);
};
