package com.spring.pets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.spring.pets")
public class PetsFApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetsFApplication.class, args);
	}

}
