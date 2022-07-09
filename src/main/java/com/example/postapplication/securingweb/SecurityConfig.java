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
import lombok.extern.slf4j.Slf4j;

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
    	 String[] permitted = new String[]{
                 "/", "/login","/png/**",
                 "/css/**","/js/**","/jquery/**"
         };
    	 http
         .csrf().disable()
         .authorizeRequests().antMatchers(permitted).permitAll()
         .antMatchers("/login").permitAll()
         .anyRequest().authenticated()
         .and()
         .formLogin()
         .loginPage("/login")
         .defaultSuccessUrl("/post", true)
         .successHandler(authenticationSuccessHandler)
         .failureUrl("/login?error=error1")
         .and()
         .logout()
         .logoutUrl("/logout")
         .deleteCookies("JSESSIONID");
    }
    
    @Bean 
    public PasswordEncoder passwordEncoder() { 
        return new BCryptPasswordEncoder(); 
    }
}