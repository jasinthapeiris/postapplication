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
package com.example.postapplication.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the Post model class for post
 * database
 */
@Setter
@Getter
@Entity
@Table(name = "post")
public class Post implements Serializable {

	private static final String POST_ID = "post_id";
	private static final String POSTED_DATE = "posted_date";
	private static final String MESSAGE = "message";
	private static final String USER_ID = "user_id";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = POST_ID)
	private Integer postId;

	@Column(name = POSTED_DATE)
	private Date postedDate;

	@Column(name = MESSAGE)
	private String message;

	@ManyToOne
	@JoinColumn(name = USER_ID)
	@JsonBackReference
	private User user;

	@Transient
	private String date;
}