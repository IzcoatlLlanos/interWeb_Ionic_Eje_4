import { Category } from "./category";
import { Calification } from "./calification";

export interface Producto {
    sku: string;
    name: string;
    description?: string
    price: number;
    category?: Category;
    calification?: Calification[];
    stock: number;
    photo?: string;
}
