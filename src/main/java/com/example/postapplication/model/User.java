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
 *        Created By :Jasintha Peiris
 */
package com.example.postapplication.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;


import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Date :2020-04-21. This class process user Model model class
 *
 * @author Jasitha peiris
 */
@Entity
@Table(name = "user", schema = "public")
public class User implements Serializable {

	@Id
	@Column(name = "user_id", unique = true)
	private String userId;

	@Column(name = "first_name")
	private String name;

	@Column(name = "middle_name")
	private String middleName;

	@Column(name = "last_name")
	private String lastName;

	
}