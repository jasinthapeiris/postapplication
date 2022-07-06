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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import com.example.postapplication.model.Post;
import com.example.postapplication.service.PostService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/05 This class process the Post operation controller
 *          class
 */
@Slf4j
@Controller
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class PostController {
	
	private final PostService postService;

	/**
	 * open post page as a model for curd operation
	 * 
	 * @return post page as a model
	 */
	@RequestMapping("/post")
	public ModelAndView post() {
		log.info("PostController post method calling.");
		ModelAndView model = new ModelAndView("post");
		//List<Post> postList=postService.findPostByUser(1);
		
		Post post =new Post();
		post.setMessage("dsfsf");
		post.setPostedDate(new Date());
		List<Post> postList=new ArrayList<>();
		postList.add(post);
		model.addObject("postList", postList);
		return model;
	}
	
	/**
	* save new post created by user
	* @param post 
	* @return redirect to post url
	*/
	@PostMapping("/save")
	public String save(@ModelAttribute Post post) {
		log.info("PostController save method calling.");
		postService.savePost(post);
		return "redirect:/post";
	}

	@RequestMapping("/editOrDelete")
	public ModelAndView editOrDelete() {
		log.info("InitController init method calling.");
		ModelAndView model = new ModelAndView("edit");
		return model;
	}

}