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
package com.example.postapplication.controller;

import com.example.postapplication.model.Post;
import com.example.postapplication.model.User;
import com.example.postapplication.service.PostService;
import com.example.postapplication.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.security.Principal;
import java.util.List;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/05 This class process the Post operation controller
 * class
 */
@Slf4j
@Controller
@RequiredArgsConstructor(onConstructor = @__({@Autowired}))
public class PostController {

	private static final String POST = "post";
	private static final String POSTLIST = "postList";
	private final PostService postService;
	private final UserService userService;

	/**
	 * open post page as a model for create and view operation
	 *
	 * @return post page as a model
	 */
	@RequestMapping("/post")
	public ModelAndView post(Principal principal) {
		log.info("PostController in post method calling.");
		ModelAndView model = new ModelAndView("post");
		String userEmail = principal.getName();
		User user = userService.findByUserEmail(userEmail);
		List<Post> postList = postService.findPostByUser(user.getUserId());
		model.addObject(POSTLIST, postList);
		return model;
	}

	/**
	 * open edit post page as a model for edit exist post
	 *
	 * @return edit post page as a model
	 */
	@RequestMapping("/editpost/{id}")
	public ModelAndView editpost(@PathVariable int id) {
		log.info("PostController editpost method calling.");
		ModelAndView model = new ModelAndView("edit");
		Post post = postService.findPostById(id);
		model.addObject(POST, post);
		return model;
	}

	/**
	 * open delete post page as a model for delete exist post
	 *
	 * @return delete post page as a model
	 */
	@RequestMapping("/deletepost/{id}")
	public ModelAndView deletepost(@PathVariable int id) {
		log.info("PostController in deletepost method calling.");
		ModelAndView model = new ModelAndView("delete");
		Post post = postService.findPostById(id);
		model.addObject(POST, post);
		return model;
	}

	/**
	 * save to new post created by user to pass to post service
	 *
	 * @param post a post object
	 * @return redirect to post url
	 */
	@PostMapping("/save")
	public String save(@ModelAttribute Post post, Principal principal) {
		log.info("PostController in save method calling.");
		String userEmail = principal.getName();
		User user = userService.findByUserEmail(userEmail);
		postService.savePost(post, user);
		return "redirect:/post";
	}

	/**
	 * open edit post page as a model for edit exist post
	 *
	 * @return edit post page as a model
	 */
	@RequestMapping("/edit")
	public String editPost(@ModelAttribute Post post) {
		log.info("PostController editpost method calling.");
		postService.updatePost(post);
		return "redirect:/post";
	}

	/**
	 * open delete post page as a model for delete exist post
	 *
	 * @return delete post page as a model
	 */
	@RequestMapping("/delete/{id}")
	public String deletePost(@PathVariable int id) {
		log.info("PostController in deletepost method calling.");
		postService.deletePost(id);
		return "redirect:/post";
	}
}