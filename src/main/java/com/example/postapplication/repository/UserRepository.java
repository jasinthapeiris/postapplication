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
 *        Created By :Jasintha peiris
 */
package com.example.postapplication.repository;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.postapplication.model.User;

import java.lang.String;

/**
 * Date :2020-04-21. This class process the crud operation extends
 * CrudRepository using springframework
 *
 * @author Jasintha peiris
 */
@Repository
@Transactional
public interface UserRepository extends CrudRepository<User, String> {
	
	
}
