/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Category } from "@bluebits/products";

export class Product {
  id?: string;
  name?: string;
  description?: string;
  richDescription?: string;
  image?: string;
  images?: string[];
  brand?: string;
  price?: number;
  category?: Category;
  countInStock?: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: number;
  dateCreated?: Date;
}
