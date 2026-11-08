package com.purav.coursemaketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CoursemaketplaceApplication {
 //
	public static void main(String[] args) {
		SpringApplication.run(CoursemaketplaceApplication.class, args);
	}

}
