/*
 *  @author Jasintha Peiris
 *  @version 0.0.1 2022/07/04 説明
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

import com.example.postapplication.model.User;
import com.example.postapplication.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the user crud operation Service
 * class
 */
@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__({@Autowired}))
public class UserService {
	private final UserRepository userRepository;

	/**
	 * findByUserId method is Returns user by given user id
	 *
	 * @param userId Integer value
	 * @return user
	 */
	@NonNull
	public User findByUserId(@NonNull Integer userId) {
		log.debug("UserService in findAllByUserId method calling.");
		return userRepository.findByUserId(userId);
	}

	/**
	 * findByUserEmail method is Returns user By User Email
	 *
	 * @param userEmail String value
	 * @return user
	 */
	@NonNull
	public User findByUserEmail(@NonNull String userEmail) {
		log.debug("UserService in findAllByUserId method calling.");
		return userRepository.findByUserEmail(userEmail);
	}

	/**
	 * authenticateUser method is Returns status after validate user
	 *
	 * @param userEmail user email value String
	 * @param password password value String
	 * @return status
	 */
	@NonNull
	public Boolean authenticateUser(@NonNull String userEmail,@NonNull String password) {
		log.debug("UserService in authenticateUser method calling.");
		User userData = userRepository.findByUserEmailAndUserPassword(userEmail, password);
		return userData != null;
	}
}