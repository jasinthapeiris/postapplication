/*
 *  @author Jasintha Peiris
 *  @version 0.0.1 2022/07/05
 *  E-Mail jasinthaamakara@gmail.com
 * 
 *  Copyright (c), Jasintha Peiris  All Rights Reserved.
 *  PROPRIETARY AND COPYRIGHT NOTICE.
 *  This software product contains information which is proprietary to
 *  and considered a trade secret Jasintha Peiris .
 *  It is expressly agreed that it shall not be reproduced in whole or part,
 *  disclosed, divulged or otherwise made available to any third party directly
 *  or indirectly.  Reproduction of this product for any purpose is prohibited
 *  without written authorization from the Jasintha Peiris
 *  All Rights Reserved.
 */
package com.example.postapplication.service;

import com.example.postapplication.model.Post;
import com.example.postapplication.model.User;
import com.example.postapplication.repository.PostRepository;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/05 This class process the post crud operation Service
 *          class
 */
@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class PostService {
	private final PostRepository postRepository;
	private final UserService userService;

	/**
	 * savePost method is save post and Return saved post
	 * 
	 * @param post
	 * @param user 
	 * @return saved post
	 */
	public @NonNull Post savePost(Post post, User user) {
		log.debug("PostService in savePost method calling.");
		post.setPostedDate(new Date());
		User exist=userService.findByUserId(user.getUserId());
		post.setUser(exist);
		return postRepository.save(post);
	}

	/**
	 * findPostByUser method is find Post By User Id and return post list
	 * 
	 * @param userId is Integer type value
	 * @return postList
	 */
	public List<Post> findPostByUser(Integer userId) {
		log.debug("PostService findPostByUser method calling.");
		List<Post> postList = postRepository.findByUserUserId(userId);
		/*
		 * for (Post post : postList) { String
		 * ddd=SimpleDateFormat.getDateInstance(SimpleDateFormat.LONG,
		 * Locale.JAPAN).format(post.getPostedDate()); String
		 * dddsa=SimpleDateFormat.getDateTimeInstance(SimpleDateFormat.LONG,
		 * SimpleDateFormat.LONG, Locale.JAPAN).format(post.getPostedDate());;
		 * System.out.println("ddd="+ddd); System.out.println("ddd="); }
		 */
		return postList;
	}
	
	/**
	 * findPostById method is find Post By Id and return post
	 * 
	 * @param userId is Integer type value
	 * @return postList
	 */
	public Post findPostById(Integer postId) {
		log.debug("PostService in findPostById method calling.");
		Post post = postRepository.findByPostId(postId);
		return post;
	}

	/**
	 * updatePost method is update exist post 
	 * @param post
	 * @return updatedPost
	 */
	public Post updatePost(Post post) {
		log.debug("PostService in updatePost method calling.");
		post.setPostedDate(new Date());
		Post existPost=findPostById(post.getPostId());
		post.setUser(existPost.getUser());
		return postRepository.save(post);
	}

	/**
	 * deletePost method is delete exist post 
	 * 
	 * @param id
	 * @return deletedPost
	 */
	public void deletePost(int id) {
		log.debug("PostService deletePost method calling.");
		Post deletedPost=postRepository.findByPostId(id);
		//postRepository.delete(deletedPost);
		postRepository.deleteById(id);
	}
}