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
package com.example.postapplication.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/04 This class process the User model class for user
 * database
 */
@Setter
@Getter
@Entity
@Table(name = "user")
public class User implements Serializable {
	private static final String USER_ID = "user_id";
	private static final String USER_NAME = "user_name";
	private static final String USER_E_MAIL = "user_e_mail";
	private static final String USER_PASSWORD = "user_password";
	private static final String USER_SALT = "user_salt";
	private static final String USER_UNLOCK = "user_unlock";
	private static final String USER = "user";

	@OneToMany(mappedBy = USER)
	@JsonManagedReference
	Set<Post> post = new HashSet<>();

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = USER_ID)
	private Integer userId;

	@Column(name = USER_NAME)
	private String userName;

	@Column(name = USER_E_MAIL)
	private String userEmail;

	@Column(name = USER_PASSWORD)
	private String userPassword;

	@Column(name = USER_SALT)
	private String userSalt;

	@Column(name = USER_UNLOCK)
	private Date userUnlock;
}