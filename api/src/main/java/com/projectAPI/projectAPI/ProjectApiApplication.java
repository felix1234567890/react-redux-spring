package com.projectAPI.projectAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// WebMvcConfigurerAdapter is deprecated in Spring Boot 3.x, use WebMvcConfigurer instead

@SpringBootApplication
public class ProjectApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProjectApiApplication.class, args);
	}
}
