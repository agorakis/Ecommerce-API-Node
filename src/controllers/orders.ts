import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const getOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: { userId: req.body.user.id },
  });

  res.send(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: { id: Number(req.params.id) },
      include: { products: true, events: true },
    });

    res.send(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: { id: Number(req.params.id) },
      data: { status: "CANCELLED" },
    });

    await prismaClient.orderEvent.create({
      data: { orderId: order.id, status: "CANCELLED" },
    });

    res.send(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await prismaClient.cartItem.findMany({
      where: { userId: req.body.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.send("Cart is empty");
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * Number(current.product.price);
    }, 0);

    const address = await tx.address.findFirst({
      where: { id: req.body.user?.defaultShippingAddress },
    });

    const order = await tx.order.create({
      data: {
        userId: req.body.user.id,
        netAmount: price,
        address: address?.formattedAddress ?? "",
        products: {
          create: cartItems.map((cart) => {
            return { productId: cart.productId, quantity: cart.quantity };
          }),
        },
      },
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    await tx.cartItem.deleteMany({
      where: { userId: req.body.user.id },
    });

    return res.send(order);
  });
};
