/*
 *     Copyright (c), Jasintha Peiris  All Rights Reserved.
 *     *  PROPRIETARY AND COPYRIGHT NOTICE.
 *
 *        This software product contains information which is proprietary to
 *        and considered a trade secret Jasintha Peiris .
 *        It is expressly agreed that it shall not be reproduced in whole or part,
 *        disclosed, divulged or otherwise made available to any third party directly
 *        or indirectly.  Reproduction of this product for any purpose is prohibited
 *        without written authorization from the Jasintha Peiris
 *        All Rights Reserved.
 *
 *        E-Mail jasinthaamakara@gmail.com
 *        Created By : Jasintha Peiris
 */
package com.example.postapplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import com.example.postapplication.model.User;
import com.example.postapplication.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Date :2022-07-02. This class process the Init operation controller class
 * 
 * @author Jasintha Peiris
 */
@Slf4j
@Controller
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class InitController {

	private final UserService userService;

	/**
	 * Login Page
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("/")
	public ModelAndView init() {
		log.info("InitController init method calling.");
		ModelAndView model = new ModelAndView("login");
		Iterable<User> d = userService.findAllByUserId();
		return model;
	}
	
	@RequestMapping("/post")
	public ModelAndView post() {
		log.info("InitController init method calling.");
		ModelAndView model = new ModelAndView("post");
		return model;
	}
	
	@RequestMapping("/register")
	public ModelAndView register() {
		log.info("InitController init method calling.");
		ModelAndView model = new ModelAndView("register");
		
		return model;
	}
}