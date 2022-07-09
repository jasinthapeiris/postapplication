/*
 *  @author Jasintha Peiris
 *  @version 0.0.1 2022/07/05 
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

import javax.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.postapplication.model.Post;
import java.util.List;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the Post crud operation extends
 *          CrudRepository using springframework
 */
@Repository
@Transactional
public interface PostRepository extends CrudRepository<Post, Integer> {
	List<Post> findByUserUserId(Integer userId);

	Post findByPostId(Integer postId);
}