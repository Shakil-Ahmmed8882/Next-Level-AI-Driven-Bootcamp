
import fs from "fs";

export const getProducts = () => {

    const data = fs.readFileSync("./src/database/data.json", "utf-8");
    const products = JSON.parse(data); 
    return products;
}

export type TProduct = {
    id: number;
    name: string;
    price: number;
    description: string;
}
export const insertProduct = (product: TProduct): void => {
    const filePath = process.cwd() + "/src/database/data.json";
    const data = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(data);
    products.push(product);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}