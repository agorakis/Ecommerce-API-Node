import { Request, Response } from "express";
import { prismaClient } from "..";
import { CreateProductSchema } from "../schema/products";

export const createProduct = async (req: Request, res: Response) => {
  CreateProductSchema.shape.body.parse(req.body);
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
