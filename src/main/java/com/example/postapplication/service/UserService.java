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
	 * Returns user from given user id
	 * 
	 * @param userId Integer value
	 * @return user
	 */
	public User findAllByUserId(Integer userId) {
		log.debug("UserService in findAllByUserId method calling.");
		User user = userRepository.findByUserId(userId);
		return user;
	}

	/**
	 * Returns status after validate user
	 * 
	 * @param user 
	 * @return status
	 */
	public Boolean authenticateUser(User user) {
		log.debug("UserService in authenticateUser method calling.");
		User userData = userRepository.findByUserEmail(user.getUserEmail());
		Boolean status=false;
		if(userData!=null) {
		 status=validatePassword(userData,user.getUserPassword());
		 return status;
		}
		return status;
	}

	
	//password check karana eka methana liyanna ona
	private Boolean validatePassword(User userData, String userPassword) {
		log.debug("UserService in validatePassword method calling.");
		
		return null;
	}
}