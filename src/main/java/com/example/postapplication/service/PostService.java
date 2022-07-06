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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
	 * @return saved post
	 */
	public @NonNull Post savePost(Post post) {
		log.debug("PostService in savePost method calling.");
		post.setPostedDate(new Date());
		User u=userService.findAllByUserId(1);
		post.setUser(u);
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
}