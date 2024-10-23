import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddCartSchema, ChangeQuantitySchema } from "../schema/cart";
import { Product } from "@prisma/client";

export const getUserCart = async (req: Request, res: Response) => {
  const userCart = await prismaClient.cartItem.findMany({
    where: { userId: req.body.user.id },
    include: { product: true },
  });

  res.send({ userCart });
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const cartItem = await prismaClient.cartItem.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  if (cartItem.userId !== req.body.user.id) {
    throw new NotFoundException(
      "Product does not belong to user's cart",
      ErrorCode.CART_ITEM_DOES_NOT_BELONG
    );
  }
  const deletedCartItem = await prismaClient.cartItem.delete({
    where: { id: cartItem.id },
  });

  res.send(deletedCartItem);
};

export const addItemToCart = async (req: Request, res: Response) => {
  const validateData = AddCartSchema.parse(req.body);

  const productAlredyExistInCart = await prismaClient.cartItem.findFirst({
    where: { productId: validateData.productId, userId: req.body.user.id },
  });

  if (productAlredyExistInCart) {
    const cartItemUpdated = await prismaClient.cartItem.update({
      where: {
        id: productAlredyExistInCart.id,
        // productId: validateData.productId,
        // userId: req.body.user.id,
      },
      data: {
        // ...productAlredyExistInCart,
        quantity: productAlredyExistInCart.quantity + validateData.quantity,
      },
    });

    res.send(cartItemUpdated);
  } else {
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
  }
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeQuantitySchema.shape.body.parse(req.body);
  const updatedCart = await prismaClient.cartItem.update({
    where: { id: Number(req.params.id) },
    data: { quantity: validatedData.quantity },
  });
  res.send(updatedCart);
};
