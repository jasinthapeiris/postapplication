package com.example.postapplication.securingweb;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import com.example.postapplication.repository.UserRepository;
import com.example.postapplication.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor = @__({ @Autowired }))
public class CustomAuthenticationProvider implements AuthenticationProvider {
	private final UserService userService;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username = authentication.getName();
		String password = authentication.getCredentials().toString();
		if (shouldAuthenticateAgainstThirdPartySystem(username, password)) {
			// use the credentials and authenticate against the third-party system
			return new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>());
		} else {
			return null;
		}
	}

	private boolean shouldAuthenticateAgainstThirdPartySystem(String username, String password) {
		if (userService.authenticateUser(username, password)) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}
}