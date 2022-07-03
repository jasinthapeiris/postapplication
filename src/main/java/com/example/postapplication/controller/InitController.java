/*
 *     Copyright (c) 1995-2021,  The Data Management Group Ltd   All Rights Reserved.
 *     *  PROPRIETARY AND COPYRIGHT NOTICE.
 *
 *        This software product contains information which is proprietary to
 *        and considered a trade secret The Data management Group Ltd .
 *        It is expressly agreed that it shall not be reproduced in whole or part,
 *        disclosed, divulged or otherwise made available to any third party directly
 *        or indirectly.  Reproduction of this product for any purpose is prohibited
 *        without written authorisation from the The Data Management Group Ltd
 *        All Rights Reserved.
 *
 *        E-Mail andyj@datam.co.uk
 *        URL : www.datam.co.uk
 *        Created By :Athula Perera
 */
package com.example.postapplication.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.example.postapplication.model.User;
import com.example.postapplication.repository.UserRepository;
import com.example.postapplication.service.UserService;

/**
 * Date :2022-01-04. This class process the Init operation controller class
 * 
 * @author Jasintha Peiris
 */
@Controller
public class InitController {
	private static final Logger log = LoggerFactory.getLogger(InitController.class);
	
	
	@Autowired
	private UserService userService;

	/**
	 * Login Page 
	 * @param session
	 * @return
	 */
	@RequestMapping("/")
	public ModelAndView init() {
		ModelAndView model=new ModelAndView("login");
		Iterable<User> d=userService.findAllByUserId();
		
		return model;
	}
}