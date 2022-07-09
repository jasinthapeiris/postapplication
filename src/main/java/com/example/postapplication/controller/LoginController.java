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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the Login operation controller
 * class
 */
@Slf4j
@Controller
@RequiredArgsConstructor(onConstructor = @__({@Autowired}))
public class LoginController {
	/**
	 * Returns login page for login to user
	 *
	 * @return login page as a model
	 */
	@RequestMapping("/login")
	public ModelAndView login() {
		log.info("LoginController login method calling.");
		return new ModelAndView("login");
	}
}