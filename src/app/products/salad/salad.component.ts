import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/interfaces/product.interface';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-salad',
  templateUrl: './salad.component.html',
  styleUrls: ['./salad.component.scss']
})
export class SaladComponent implements OnInit {

  products: Array<IProduct> = [];
  constructor(private prodService: ProductsService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    this.prodService.getProducts().subscribe(
      data => {
        if (data.some(data => data.category.name === 'salad')) {
          data = data.filter(data => data.category.name === 'salad')
          this.products = data;
          console.log(this.products);
        }
      }
    );
  }

  productCount(product: IProduct, status: boolean): void {
    if (status) {
      product.count++;
    }
    else {
      if (product.count > 1) {
        product.count--;
      }
    }
  }

  addToBasket(product: IProduct): void {
    console.log(product);
    this.orderService.addBasket(product);
    product.count = 1;
  }

}
