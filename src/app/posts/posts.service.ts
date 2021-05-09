import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment'
const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    public postUpdated = new Subject<{posts: Post[], count: number}>();

    constructor(private http: HttpClient, private router: Router){}

    getPosts(pageSize: number, page: number){
        const query = `?pageSize=${pageSize}&page=${page}`;
        console.log(query);

        this.http.get<{message: string, posts: any, count: number}>(BACKEND_URL + query)
        .pipe(map((postData) => {
            return {posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
            }), count: postData.count};
        }))
        .subscribe((postData) => {
            console.log(postData);

            this.posts = postData.posts;
            this.postUpdated.next({posts: postData.posts, count: postData.count});
        });
    }
    getUpdatedPosts(){
        return this.postUpdated.asObservable();
    }
    addPost(post){
        this.http.post<{message: string, post: Post}>(BACKEND_URL, post)
        .subscribe((res) => {
            this.router.navigate(['/']);
        });
    }

    getPost(id){
        return this.http.get<{title: string, content: string, _id: string, imagePath: string,creator: string}>(BACKEND_URL + id);
    }

    deletePost(id){
        return this.http.delete(BACKEND_URL + id);
    }

    updatePost(post, id){
        this.http.put(BACKEND_URL + id, post)
        .subscribe(res => {
            this.router.navigate(['/']);
        });
    }
}
