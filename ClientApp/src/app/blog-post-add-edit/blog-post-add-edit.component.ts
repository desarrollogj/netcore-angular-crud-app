import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blogpost';

@Component({
  selector: 'app-blog-post-add-edit',
  templateUrl: './blog-post-add-edit.component.html',
  styleUrls: ['./blog-post-add-edit.component.css']
})
export class BlogPostAddEditComponent implements OnInit {
  form: FormGroup;
  actionType: string;

  formCreator: string;
  formTitle: string;
  formBody: string;
  postId: number;

  errorMessage: any;
  existingBlogPost: BlogPost;

  constructor(private blogPostService: BlogPostService, private formBuilder: FormBuilder,
              private avRoute: ActivatedRoute, private router: Router) {
                const idParam = 'id';
                this.actionType = 'Add';
                this.formCreator = 'creator';
                this.formTitle = 'title';
                this.formBody = 'body';

                if (this.avRoute.snapshot.params[idParam]) {
                  this.postId = this.avRoute.snapshot.params[idParam];
                }

                this.form = this.formBuilder.group(
                  {
                    postId: 0,
                    creator: ['', [Validators.required]],
                    title: ['', [Validators.required]],
                    body: ['', [Validators.required]],
                  }
                );
    }

  ngOnInit(): void {
    if (this.postId > 0) {
      this.actionType = 'Edit';
      this.blogPostService.getBlogPost(this.postId)
        .subscribe(data => (
          this.existingBlogPost = data,
          this.form.controls[this.formCreator].setValue(data.creator),
          this.form.controls[this.formTitle].setValue(data.title),
          this.form.controls[this.formBody].setValue(data.body)
        ));
    }
  }

  save(): void {
    if (!this.form.valid) {
      return;
    }

    if (this.actionType === 'Add') {
      const blogPost: BlogPost = {
        dt: new Date(),
        creator: this.form.get(this.formCreator).value,
        title: this.form.get(this.formTitle).value,
        body: this.form.get(this.formBody).value
      };

      this.blogPostService.saveBlogPost(blogPost)
        .subscribe((data) => {
          this.router.navigate(['/blogposts']);
        });
    }

    if (this.actionType === 'Edit'){
      const blogPost: BlogPost = {
        postId: this.existingBlogPost.postId,
        dt: this.existingBlogPost.dt,
        creator: this.existingBlogPost.creator,
        title: this.form.get(this.formTitle).value,
        body: this.form.get(this.formBody).value
      };
      this.blogPostService.updateBlogPost(blogPost.postId, blogPost)
        .subscribe((data) => {
          this.router.navigate(['/blogposts']);
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  get creator(): AbstractControl { return this.form.get(this.formCreator); }
  get title(): AbstractControl { return this.form.get(this.formTitle); }
  get body(): AbstractControl { return this.form.get(this.formBody); }
}
