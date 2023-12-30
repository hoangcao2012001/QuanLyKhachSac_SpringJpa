package com.se;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		System.out.println("Starting real_estate service");
		SpringApplication.run(Application.class, args);
	}

}
