export interface SingUp {
    name: string;
    email: string;
    password: string;
}

export interface login {
    email: string;
    password: string; 
}

export interface product {
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    id: string;
    quantity: undefined | number;
    productId: undefined | string;
}

export interface cart {
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    id: string | undefined;
    quantity: undefined | number;
    userId:string;
    productId:string;
}

export interface priceSummary {
    price: number;
    discount: number;
    taxy: number;
    delivery: number;
    total: number;
}

export interface order {
    email: string;
    address: string;
    contact: string;
    totalPrice: number;
    pay: string;
    userId: string;
    id:string|undefined;
}