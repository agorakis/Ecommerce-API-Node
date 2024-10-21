import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema } from "../schema/users";

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
