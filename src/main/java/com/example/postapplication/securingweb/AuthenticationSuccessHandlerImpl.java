package com.example.postapplication.securingweb;

import java.io.IOException;

import java.security.Principal;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.postapplication.controller.LoginController;
import com.example.postapplication.model.User;
import com.example.postapplication.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {
	private final HttpSession session;
	private final UserRepository userRepository; // autowire the user repo

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		// TODO Auto-generated method stub
		String userEmail = "";
		String userName = "";
		if (authentication.getPrincipal() instanceof Principal) {
			userEmail = ((Principal) authentication.getPrincipal()).getName();
		} else {
			userEmail = authentication.getPrincipal().toString();
			User user = userRepository.findByUserEmail(userEmail);
			userName = user.getUserName();
		}
		log.info("userName: " + userName);
		session.setAttribute("userName", userName);
		response.sendRedirect("/post");
	}
}
