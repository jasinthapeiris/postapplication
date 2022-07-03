/*
 *     Copyright (c) 1995-2020,  The Data Management Group Ltd   All Rights Reserved.
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
 *        Created By :jasintha peiris
 */
package com.example.postapplication.service;

import com.example.postapplication.model.User;
import com.example.postapplication.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Date :2019-04-20. This class process the crud operation Service class
 *
 * @author Jasintha peiris
 */
@Component
public class UserService {
	private static final Logger log = LoggerFactory.getLogger(UserService.class);
	@Autowired
	private UserRepository userRepository;
	
	/**
	 * findAllByUserId method is find all data by master Id
	 *
	 * @return findAllByUserId
	 */
	public Iterable<User> findAllByUserId() {
		if (log.isDebugEnabled()) {
			log.debug("calling UserService in findAllByUserId method");
		}
		Iterable<User> userByUserId = userRepository.findAll();
		return userByUserId;
	}

}