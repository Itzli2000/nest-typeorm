import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/initialData';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async executeSeed() {
    await this.insertNewProducts();
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];
    products.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });
    await Promise.all(insertPromises);
    return true;
  }
}
