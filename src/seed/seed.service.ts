import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ProductsService } from '../products/products.service';
import { initialData, SEED_EXECUTED } from './data/initialData';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async executeSeed() {
    await this.deleteTables();
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return SEED_EXECUTED;
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];
    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });
    await Promise.all(insertPromises);
    return true;
  }

  private async insertNewUsers(): Promise<User> {
    const seedUsers = initialData.users;
    const createdUsers: User[] = [];

    for (const userData of seedUsers) {
      const { password, ...userInfo } = userData;
      const createdUser = await this.authService.create({
        ...userInfo,
        password,
      });

      if (createdUser) {
        const savedUser = await this.userRepository.findOne({
          where: { email: createdUser.email },
        });
        if (savedUser) {
          createdUsers.push(savedUser);
        }
      }
    }

    return createdUsers[0];
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }
}
