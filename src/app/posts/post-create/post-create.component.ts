import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import {PostsService} from '../posts.service';
import {mimeType} from './mime-type.validator';
@Component({
    selector: 'post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    title = '';
    content = '';
    post: Post;
    postId: string;
    type = 'create';
    form: FormGroup;
    imagePreview = '';
    public isLoading = false;

    constructor(private auth: AuthService, private postsService: PostsService, private routes: ActivatedRoute){}

    ngOnInit(){
        this.auth.getAuthStatusUpdate().subscribe(status => {
            this.isLoading = false;
        });
        this.form = new FormGroup({
            title: new FormControl(null,
                {validators: [Validators.required, Validators.minLength(3)]}
            ),
            content: new FormControl(null,
                {validators: [Validators.required]}
            ),
            image: new FormControl(null,
                {
                    validators: [Validators.required],
                    asyncValidators: [mimeType]
                }
            )
        });
        this.routes.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')){
                this.type = 'edit';
                this.isLoading = true;
                this.postsService.getPost(paramMap.get('postId'))
                .subscribe((res) => {
                    this.post = {
                        title: res.title,
                        content: res.content,
                        id: res._id,
                        imagePath: res.imagePath,
                        creator: res.creator
                    };
                    this.isLoading = false;
                    this.form.setValue({
                        title: res.title,
                        content: res.content,
                        image: res.imagePath
                    });
                });
                // console.log(this.post);

            } else{
                this.type = 'create';
                this.post = null;
            }
        });
    }

    savePost(){
        if (this.form.invalid){
            return;
        }
        let postData;
        if (typeof (this.form.value.image) == 'string'){
            postData  = {
                id: this.post ? this.post.id : null,
                title: this.form.value.title,
                content: this.form.value.content,
                imagePath: this.form.value.image,
                creator: null
            };
        } else{
            postData = new FormData();
            postData.append('id', this.post ? this.post.id : null);
            postData.append('title', this.form.value.title);
            postData.append('content', this.form.value.content);
            postData.append('image', this.form.value.image, this.form.value.title);
        }
        this.isLoading = true;
        if (this.type == 'create'){
            this.postsService.addPost(postData);
        } else{
            this.postsService.updatePost(postData, this.post.id);
        }

        this.form.reset();
    }

    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            image: file
        });
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }
        reader.readAsDataURL(file);
    }
}
