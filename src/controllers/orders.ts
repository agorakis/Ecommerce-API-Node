import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { UpdateOrderStatusSchema } from "../schema/orders";

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
    const result = await prismaClient.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!order) {
        throw new NotFoundException(
          "Order not found",
          ErrorCode.ORDER_NOT_FOUND
        );
      }

      if (order.userId !== req.body.user.id) {
        throw new UnauthorizedException(
          "You cannot cancel this order",
          ErrorCode.UNAUTHORIZED_EXCEPTION
        );
      }

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      await tx.orderEvent.create({
        data: { orderId: updatedOrder.id, status: "CANCELLED" },
      });

      return updatedOrder;
    });
    res.send(result);
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

export const getAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};

  const status = req.query.status;
  if (status) {
    whereClause = { status };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: Number(req.query.take) || 5,
  });

  res.send(orders);
};

export const getUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: Number(req.params.id),
  };

  const status = req.query.status;
  if (status) {
    whereClause = { ...whereClause, status };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: Number(req.query.take) || 5,
  });

  res.send(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  UpdateOrderStatusSchema.shape.body.parse(req.body);

  try {
    const result = await prismaClient.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: Number(req.params.id) },
        data: { status: req.body.status },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status,
        },
      });

      return order;
    });
    res.send(result);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
