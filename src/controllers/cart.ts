import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddCartSchema } from "../schema/cart";
import { Product } from "@prisma/client";

// export const getUserAddresses = async (req: Request, res: Response) => {
//   const userAddresses = await prismaClient.address.findMany({
//     where: { userId: req.body.user.id },
//   });

//   res.send({ userAddresses });
// };

// export const deleteAddress = async (req: Request, res: Response) => {
//   try {
//     const address = await prismaClient.address.delete({
//       where: { id: Number(req.params.id) },
//     });
//     res.send(address);
//   } catch (error) {
//     throw new NotFoundException(
//       "Address not found!",
//       ErrorCode.ADDRESS_NOT_FOUND
//     );
//   }
// };

export const addItemToCart = async (req: Request, res: Response) => {
  const validateData = AddCartSchema.parse(req.body);

  let product: Product;

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: { id: validateData.productId },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.body.user.id,
      productId: validateData.productId,
      quantity: validateData.quantity,
    },
  });

  res.send(cart);
};

// export const updateUser = async (req: Request, res: Response) => {
//   const validatedData = UpdateUserSchema.parse(req.body);

//   let shippingAddress: Address;
//   let billingAddress: Address;

//   if (validatedData.defaultShippingAddress) {
//     try {
//       shippingAddress = await prismaClient.address.findFirstOrThrow({
//         where: { id: validatedData.defaultShippingAddress },
//       });
//     } catch (error) {
//       throw new NotFoundException(
//         "Address not found!",
//         ErrorCode.ADDRESS_NOT_FOUND
//       );
//     }

//     if (shippingAddress.userId !== req.body.user.id) {
//       throw new NotFoundException(
//         "Address does not belong to user",
//         ErrorCode.ADDRESS_DOES_NOT_BELONG
//       );
//     }
//   }

//   if (validatedData.defaultBillingAddress) {
//     try {
//       billingAddress = await prismaClient.address.findFirstOrThrow({
//         where: { id: validatedData.defaultBillingAddress },
//       });
//     } catch (error) {
//       throw new NotFoundException(
//         "Address not found!",
//         ErrorCode.ADDRESS_NOT_FOUND
//       );
//     }
//     if (billingAddress.userId !== req.body.user.id) {
//       throw new NotFoundException(
//         "Address does not belong to user",
//         ErrorCode.ADDRESS_DOES_NOT_BELONG
//       );
//     }
//   }

//   const updatedUser = await prismaClient.user.update({
//     where: { id: req.body.user.id },
//     data: validatedData,
//   });

//   res.send(updatedUser);
// };
