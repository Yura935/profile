import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/classes/category.model';
import { ICategory } from 'src/app/interfaces/category.interface';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  categories: Array<ICategory> = [];
  categoryID: number | string;
  categoryName: string;
  searchName: string;
  modalRef: BsModalRef;
  checkColor: string;
  check: boolean = true;
  constructor(private catService: CategoriesService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(): void {
    this.catService.getCategories().subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.check = true;
    this.categoryName = '';
  }

  addCategory(): void {
    if (this.categoryName.length > 0) {
      const newCat = new Category(1, this.categoryName);
      delete newCat.id;
      this.catService.postCategory(newCat).subscribe(() => {
        this.getCategories();
      })
      this.categoryName = '';
    }
    else if (this.categoryName.length == 0) {
      this.checkColor = 'gray';
    }
  }

  editCategory(category: ICategory): void {
    this.categoryID = category.id;
    this.categoryName = category.name;
    this.check = false;
  }

  saveEditCategory(): void {
    const updD = new Category(this.categoryID, this.categoryName);
    this.catService.updateCategory(updD).subscribe(() => {
      this.getCategories();
    });
    this.categoryName = '';
  }

  deleteCategory(category: ICategory): void {
    this.catService.deleteCategory(category).subscribe(() => {
      this.getCategories();
    })
  }
}
