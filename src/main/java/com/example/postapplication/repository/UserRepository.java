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
package com.example.postapplication.repository;

import com.example.postapplication.model.User;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the Post crud operation extends
 * CrudRepository using springframework
 */
@Repository
@Transactional
public interface UserRepository extends CrudRepository<User, Integer> {

	User findByUserId(@NonNull Integer userId);

	User findByUserEmailAndUserPassword(@NonNull String userEmail, @NonNull String password);

	User findByUserEmail(@NonNull String userEmail);
}
