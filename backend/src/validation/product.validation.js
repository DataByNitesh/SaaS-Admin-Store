import { z } from 'zod'

export const productSchema= z.object({
    name:z.string().min(1, "Name is required"),

    price:z.coerce.number().positive("price must be positive"),

    category:z.string().optional(),

    description:z.string().optional(),

    stock:z.coerce.number().min(0).optional(),

    image:z.string().optional()
})