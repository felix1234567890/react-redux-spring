package com.projectAPI.projectAPI.web;

import com.projectAPI.projectAPI.domain.Column;
import com.projectAPI.projectAPI.domain.ProjectTask;
import com.projectAPI.projectAPI.service.ColumnService;
import com.projectAPI.projectAPI.service.ProjectTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@CrossOrigin
public class ProjectTaskController {

    @Autowired
    private ProjectTaskService projectTaskService;

    @Autowired
    private ColumnService columnService;

    /**
     * Create or update a project task
     */
    @PostMapping("")
    public ResponseEntity<?> addProjectTask(@Valid @RequestBody ProjectTask projectTask, BindingResult bindingResult) {
        // Validate input
        if (bindingResult.hasErrors()) {
            Map<String, String> errorMap = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errorMap.put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
        }

        // Validate that the status corresponds to an existing column
        if (projectTask.getStatus() != null && !projectTask.getStatus().isEmpty()) {
            Column column = columnService.findById(projectTask.getStatus());
            if (column == null) {
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("status", "Invalid column ID");
                return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
            }
        }

        ProjectTask newPT = projectTaskService.saveOrUpdateProjectTask(projectTask);
        return new ResponseEntity<>(newPT, HttpStatus.CREATED);
    }

    /**
     * Get all project tasks
     */
    @GetMapping("/all")
    public Iterable<ProjectTask> getAllProjectTasks() {
        return projectTaskService.findAll();
    }

    /**
     * Get a project task by ID
     */
    @GetMapping("/{pt_id}")
    public ResponseEntity<?> getProjectTaskById(@PathVariable Long pt_id) {
        ProjectTask projectTask = projectTaskService.findById(pt_id);
        if (projectTask == null) {
            return new ResponseEntity<>("Project task not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(projectTask, HttpStatus.OK);
    }

    /**
     * Delete a project task by ID
     */
    @DeleteMapping("/{pt_id}")
    public ResponseEntity<?> deleteProjectTask(@PathVariable Long pt_id) {
        ProjectTask projectTask = projectTaskService.findById(pt_id);
        if (projectTask == null) {
            return new ResponseEntity<>("Project task not found", HttpStatus.NOT_FOUND);
        }
        projectTaskService.delete(pt_id);
        return new ResponseEntity<>("Project task deleted", HttpStatus.OK);
    }

    /**
     * Delete all tasks in a specific column
     */
    @DeleteMapping("/column/{column_id}")
    public ResponseEntity<?> deleteTasksByColumn(@PathVariable String column_id) {
        Column column = columnService.findById(column_id);
        if (column == null) {
            return new ResponseEntity<>("Column not found", HttpStatus.NOT_FOUND);
        }

        projectTaskService.deleteTasksByColumnId(column_id);
        return new ResponseEntity<>("All tasks in column deleted", HttpStatus.OK);
    }
}
