import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/classes/blog.model';
import { IBlog } from 'src/app/interfaces/blog.interface';
import { BlogService } from 'src/app/services/blog.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss']
})
export class AdminBlogsComponent implements OnInit {
  adminBlogs: Array<IBlog> = [];
  blogID: number;
  blogTitle: string;
  blogText: string;
  blogAuthor: string;
  blogDate: Date = new Date();
  blogImage = 'https://media.dominos.ua/menu/product_osg_image_mobile/2019/10/03/%D0%A2%D0%B5%D1%85%D0%B0%D1%81_300dpi-min.jpg';
  editStatus = false;
  uploadPercent: Observable<number>;
  success = true;
  constructor(private blogService: BlogService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getJSONAdminBlogs();
  }

  getJSONAdminBlogs(): void {
    this.blogService.getJSONBlogs().subscribe(
      data => {
        this.adminBlogs = data;
      },
      err => {
        console.log(err);

      }
    );
  }

  addAdminBlog(): void {
    if (this.blogTitle.length > 0 && this.blogText.length > 0 && this.blogAuthor.length > 0) {
      const newD = new Blog(1, this.blogTitle, this.blogText, this.blogDate, this.blogAuthor, this.blogImage);
      delete newD.id;
      console.log(newD);
      this.blogService.postJSONBlog(newD).subscribe(() => {
        this.getJSONAdminBlogs();
      })
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.blogTitle = '';
    this.blogText = '';
    this.blogAuthor = '';
  }

  deleteAdminBlog(blog: IBlog): void {
    this.blogService.deleteJSONBlog(blog).subscribe(() => {
      this.getJSONAdminBlogs();
    });
  }

  editAdminBlog(blog: IBlog): void {
    this.blogID = blog.id;
    this.blogTitle = blog.title;
    this.blogText = blog.text;
    this.blogAuthor = blog.author;
    this.blogImage = blog.image;
    this.editStatus = true;
  }

  saveEditAdminBlog(): void {
    const updD = new Blog(this.blogID, this.blogTitle, this.blogText, this.blogDate, this.blogAuthor, this.blogImage);
    this.blogService.updateJSONBlog(updD).subscribe(() => {
      this.getJSONAdminBlogs();
    });
    this.resetForm();
    this.editStatus = false;
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    console.log(file, filePath);
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(data => {
      if (data > 0 || data < 100) {
        this.success = false;
      }
    },
      err => {
        console.log(err);

      });
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.blogImage = url;
        this.success = true;
        console.log(this.blogImage);
      });
    });
  }

}
