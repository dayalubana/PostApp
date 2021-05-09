import { Component, OnInit } from "@angular/core";
import {PostsService} from '../posts.service'
import {Post} from '../post.model'
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";
@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent  {
    isAuthenticated = false;
    userId: any;
    constructor(private postsService: PostsService,private auth: AuthService){}
    public posts: Post[] = [];
    public isLoading = true;
    postsLength = 0;
    pageSize = 2;
    pageSizeOptions = [1,2,5,10];
    currentPage = 1;
    ngOnInit(){
        this.postsService.getPosts(this.pageSize,this.currentPage);
        this.isLoading = true;
        this.userId = this.auth.getUserId();
        this.postsService.postUpdated.subscribe(postData=>{
            this.posts = postData.posts;
            this.postsLength = postData.count;
            this.isLoading = false;
        })
        this.isAuthenticated = this.auth.getAuthStatus();
        this.auth.getAuthStatusUpdate()
        .subscribe((res)=>{
            this.isAuthenticated = res;
            this.userId = this.auth.getUserId();
        })
    }
    deletePost(id){
        this.isLoading = true;
        this.postsService.deletePost(id)
        .subscribe((res)=>{
            this.postsService.getPosts(this.pageSize,this.currentPage);
        })
    }
    onChangePage(page:PageEvent){
        // this.isLoading = true;
        this.pageSize = page.pageSize;
        this.currentPage = page.pageIndex + 1;
        this.postsService.getPosts(this.pageSize,this.currentPage);
    }
}
