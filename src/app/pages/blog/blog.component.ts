import { Component, OnInit } from '@angular/core';
import { IBlog } from '../../interfaces/blog.interface';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  userBlogs: Array<IBlog> = [];
  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(): void {
    this.blogService.getJSONBlogs().subscribe(
      data => {
        this.userBlogs = data;
      },
      err => {
        console.log(err);
      }
    );
  }
}
