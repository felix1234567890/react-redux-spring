package com.projectAPI.projectAPI;

import com.projectAPI.projectAPI.service.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProjectApiApplication {
	@Autowired
	private ColumnService columnService;

	public static void main(String[] args) {
		SpringApplication.run(ProjectApiApplication.class, args);
	}

	/**
	 * Initialize default columns on application startup
	 */
	@Bean
	CommandLineRunner init() {
		return args -> {
			columnService.initializeDefaultColumns();
		};
	}
}
