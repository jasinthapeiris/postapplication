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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the user crud operation Service
 *          class
 */
@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class UserService {
	private final UserRepository userRepository;

	/**
	 * findByUserId method is Returns user by given user id
	 * 
	 * @param userId Integer value
	 * @return user
	 */
	public User findByUserId(Integer userId) {
		log.debug("UserService in findAllByUserId method calling.");
		User user = userRepository.findByUserId(userId);
		return user;
	}
	
	/**
	 * findByUserEmail method is Returns user By User Email
	 * 
	 * @param userEmail String value
	 * @return user
	 */
	public User findByUserEmail(String userEmail) {
		log.debug("UserService in findAllByUserId method calling.");
		User user = userRepository.findByUserEmail(userEmail);
		return user;
	}

	/**
	 * authenticateUser method is Returns status after validate user
	 * 
	 * @param user
	 * @return status
	 */
	public Boolean authenticateUser(String userEmail, String password) {
		log.debug("UserService in authenticateUser method calling.");
		Boolean status = false;
		User userData = userRepository.findByUserEmailAndUserPassword(userEmail, password);
		if (userData != null) {
			status = true;
		}
		return status;
	}

	/**
	 * findUserByEmailPsw method is Returns find User By Email Password
	 * 
	 * @param user
	 * @return user
	 */
	public User findUserByEmailPsw(User user) {
		log.debug("UserService in authenticateUser method calling.");
		User userData = userRepository.findByUserEmailAndUserPassword(user.getUserEmail(), user.getUserPassword());
		return userData;
	}
}