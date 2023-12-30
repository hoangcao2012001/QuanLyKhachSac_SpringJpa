package com.se.config;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.se.entity.Customer;
import com.se.service.CustomerService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	CustomerService Service;

	@Autowired
	BCryptPasswordEncoder pe;

//	//cung cap nguon dl dang nhap
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(username -> {
			try {
				Customer user = Service.FindCustomeṛ̣̣̣ById(username);
				String password = user.getPassword();
				System.out.print(user);
				System.out.print(user.getPassword());
				/*
				 * Boolean active = user.getIsActive(); 
				 * Boolean delete = user.getIsDisable();
				 * Boolean isActive = false; 
				 * if (active == false || delete == true) { isActive =
				 * true; }
				 */
				String[] roles = user.getAuthorities().stream().map(er -> er.getRole().getId())
						.collect(Collectors.toList()).toArray(new String[0]);
				System.out.print(User.withUsername(username).password(password).roles(roles).build());
				return User.withUsername(username).password(pe.encode(password)).roles(roles).build();
			} catch (Exception e) {
				throw new UsernameNotFoundException(username + " not found");
			}
		});
	}

//phan quyen truy cap

	
	  protected void configure(HttpSecurity http) throws Exception {
	  http.csrf().disable();
	  
		
		  http.authorizeRequests() .antMatchers(
		  "/user/repass", "/user/change").authenticated()// kiểm tra đăng nhập
		  .antMatchers("/admin/**")// kiểm tra quyên athorization
		  .hasAnyRole("STAFF","ADMIN").anyRequest().permitAll();
		 
	  
	  
	  
	  http.formLogin().loginPage("/user/sign-in").loginProcessingUrl(
	  "/user/sign-in").defaultSuccessUrl("/sign-in/success",
	  false).failureUrl("/user/sign-in/erro").permitAll();
	  
	  http.rememberMe().tokenValiditySeconds(86400);
	  
	  http.exceptionHandling().accessDeniedPage("/user/unauthoried");
	  
	  http.logout().logoutUrl("/user/logoff").logoutSuccessUrl(
	  "/user/logoff/success"); } // Oauth2 }
	 
//	//co che ma hoa mat khau
	@Bean
	public BCryptPasswordEncoder getpPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

//	
	// cho phep truy xuat rest api tu ben ngoai
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
	}
}
