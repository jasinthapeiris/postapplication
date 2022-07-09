/*
 *  @author Jasintha Peiris
 *  @version 0.0.1 2022/07/04 
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

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import com.example.postapplication.model.User;
import com.example.postapplication.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the Login operation controller
 *          class
 */
@Slf4j
@Controller
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class LoginController {

	private static final String ERROR = "メールアドレス、もしくはパスワードが間違っています";
private final UserService userService;

/**
 * Returns login page for login to user
 * 
 * @return login page as a model
 */
@RequestMapping("/login")
public ModelAndView login() {
	log.info("LoginController login method calling.");
	ModelAndView model = new ModelAndView("login");
	return model;
}

/**
 * save new post created by user
 * 
 * @param post
 * @return redirect to post url
 */
@PostMapping("/verify")
public String verfiyUser(@ModelAttribute User user, HttpSession session) {
	log.info("LoginController in verfiyUser method calling.");
	//Boolean status = userService.authenticateUser(user);
	//if (status == true) {
	//	User userData = userService.findUserByEmailPsw(user);
	//	session.setAttribute("loginUser", userData);
	//	return "redirect:/post";
	//} else {
	//	session.setAttribute("error1", ERROR);
	//	return "redirect:/login";
	//}
	return null;
}

/**
 * logout is log out created by user
 * 
 * @param post
 * @return redirect to post url
 */
@RequestMapping(value = "logout", method = RequestMethod.GET)
	public void logout(HttpSession session) {
		session.invalidate();
	}
}