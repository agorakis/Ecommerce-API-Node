import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import {
  AddressSchema,
  UpdateUserRoleSchema,
  UpdateUserSchema,
} from "../schema/users";
import { Address } from "@prisma/client";

export const getUserAddresses = async (req: Request, res: Response) => {
  const userAddresses = await prismaClient.address.findMany({
    where: { userId: req.body.user.id },
  });

  res.send({ userAddresses });
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await prismaClient.address.delete({
      where: { id: Number(req.params.id) },
    });
    res.send(address);
  } catch (error) {
    throw new NotFoundException(
      "Address not found!",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const createAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const { lineOne, lineTwo, pincode, country, city } = req.body;

  const address = await prismaClient.address.create({
    data: {
      lineOne: lineOne,
      lineTwo: lineTwo,
      pincode: pincode,
      country: country,
      city: city,
      userId: req.body.user.id,
    },
  });

  res.send(address);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);

  let shippingAddress: Address;
  let billingAddress: Address;

  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validatedData.defaultShippingAddress },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found!",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (shippingAddress.userId !== req.body.user.id) {
      throw new NotFoundException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validatedData.defaultBillingAddress },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found!",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId !== req.body.user.id) {
      throw new NotFoundException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: req.body.user.id },
    data: validatedData,
  });

  res.send(updatedUser);
};

export const getUsers = async (req: Request, res: Response) => {
  const count = await prismaClient.user.count();

  const allUsers = await prismaClient.user.findMany({
    skip: Number(req.query.skip) || 0,
    take: Number(req.query.take) || 5,
  });

  res.send({ count: count, users: allUsers });
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: { id: Number(req.params.id) },
      include: { addresses: true },
    });
    res.send(user);
  } catch (error) {
    throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  UpdateUserRoleSchema.shape.body.parse(req.body);

  try {
    const user = await prismaClient.user.update({
      where: { id: Number(req.params.id) },
      data: { role: req.body.role },
    });
    res.send(user);
  } catch (error) {
    throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND);
  }
};
