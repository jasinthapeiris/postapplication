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

import com.example.postapplication.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/07 This class process to the Custom Authentication
 * Provider
 */
@Component
@RequiredArgsConstructor(onConstructor = @__({@Autowired}))
public class CustomAuthenticationProvider implements AuthenticationProvider {

	private final UserService userService;

	/**
	 * authenticate is authenticate to application using given user email and
	 * password
	 *
	 * @param authentication {@link Authentication} object
	 * @return UsernamePasswordAuthenticationToken
	 */
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username = authentication.getName();
		String password = authentication.getCredentials().toString();

		if (shouldAuthenticateAgainstThirdPartySystem(username, password)) {
			// use the credentials and authenticate against the database
			return new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>());
		}

		return null;
	}

	/**
	 * shouldAuthenticateAgainstThirdPartySystem is authenticated by authenticate
	 * using database
	 *
	 * @param username username value
	 * @param password password value
	 * @return boolean value
	 */
	private boolean shouldAuthenticateAgainstThirdPartySystem(String username, String password) {
		return userService.authenticateUser(username, password);
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}
}