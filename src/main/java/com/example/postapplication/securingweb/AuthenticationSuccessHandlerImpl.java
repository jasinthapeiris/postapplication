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
package com.example.postapplication.securingweb;

import com.example.postapplication.model.User;
import com.example.postapplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.Principal;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/07 This class process to the Authentication Success
 * Handler class
 */
@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__({@Autowired}))
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {

	private final HttpSession session;
	private final UserRepository userRepository;

	/**
	 * onAuthenticationSuccess is onAuthentication Success,user add to session and
	 * Redirect to post url
	 *
	 * @param request        {@link HttpServletRequest} object
	 * @param response       {@link HttpServletResponse} object
	 * @param authentication {@link Authentication} object
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
										Authentication authentication) throws IOException {
		String userEmail;
		String userName;

		if (authentication.getPrincipal() instanceof Principal) {
			userEmail = ((Principal) authentication.getPrincipal()).getName();
		} else {
			userEmail = authentication.getPrincipal().toString();
		}
		User user = userRepository.findByUserEmail(userEmail);
		userName = user.getUserName();

		log.info("userName: {}", userName);
		session.setAttribute("userName", userName);

		response.sendRedirect("/post");
	}
}