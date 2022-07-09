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
package com.example.postapplication.securingweb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;

/**
 * @author Jasintha Peiris
 * @version 0.0.1 2022/07/07 This class process to the Security Config
 */
@Configuration
@EnableWebSecurity
@ComponentScan("com.baeldung.security")
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final CustomAuthenticationProvider authProvider;
	private final AuthenticationSuccessHandler authenticationSuccessHandler;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(authProvider);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		String[] permitted = new String[] { "/", "/login", "/png/**", "/css/**", "/js/**", "/jquery/**" };
		http.csrf().disable().authorizeRequests().antMatchers(permitted).permitAll().antMatchers("/login").permitAll()
				.anyRequest().authenticated().and().formLogin().loginPage("/login").defaultSuccessUrl("/post", true)
				.successHandler(authenticationSuccessHandler).failureUrl("/login?error=error1").and().logout()
				.logoutUrl("/logout").deleteCookies("JSESSIONID");
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}