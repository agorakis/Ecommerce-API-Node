import { Request, Response } from "express";
import { prismaClient } from "..";
import { UpdateCreateProductSchema } from "../schema/products";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const getProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const allProducts = await prismaClient.product.findMany({
    skip: Number(req.query.skip) || 0,
    take: Number(req.query.take) || 5,
  });

  res.send({ count: count, products: allProducts });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: Number(req.params.id) },
    });
    res.send(product);
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.send(product);
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const createProduct = async (req: Request, res: Response) => {
  UpdateCreateProductSchema.shape.body.parse(req.body);
  const { name, description, price, tags } = req.body;

  const product = await prismaClient.product.create({
    data: {
      name: name,
      description: description,
      price: price,
      tags: tags.join(","),
    },
  });

  res.send(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  UpdateCreateProductSchema.shape.body.parse(req.body);

  try {
    let product = req.body;

    delete product.user;

    if (product.tags) {
      product.tags = product.tags.join(",");
    }

    const updateProduct = await prismaClient.product.update({
      where: { id: Number(req.params.id) },
      data: product,
    });
    res.send(updateProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};
