import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<ICategory>, field: string): Array<ICategory> {
    if (!value) {
      return value
    }
    if (!field) {
      return value
    }
    return value.filter(phone => phone.name.toLocaleLowerCase().includes(field));
  }

}
