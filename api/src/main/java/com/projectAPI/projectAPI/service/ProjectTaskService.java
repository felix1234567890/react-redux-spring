package com.projectAPI.projectAPI.service;

import com.projectAPI.projectAPI.domain.Column;
import com.projectAPI.projectAPI.domain.ProjectTask;
import com.projectAPI.projectAPI.repository.ColumnRepository;
import com.projectAPI.projectAPI.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectTaskService {
    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private ColumnRepository columnRepository;

    /**
     * Save or update a project task
     * Validates that the status corresponds to an existing column
     */
    @Transactional
    public ProjectTask saveOrUpdateProjectTask(ProjectTask projectTask) {
        // Set default status if none provided
        if (projectTask.getStatus() == null || projectTask.getStatus().isEmpty()) {
            projectTask.setStatus("TO_DO");
        } else {
            // Validate that the status corresponds to an existing column
            Column column = columnRepository.findById(projectTask.getStatus()).orElse(null);
            if (column == null) {
                // If column doesn't exist, default to TO_DO
                projectTask.setStatus("TO_DO");
            }
        }

        return projectTaskRepository.save(projectTask);
    }

    /**
     * Find all project tasks
     */
    public Iterable<ProjectTask> findAll() {
        return projectTaskRepository.findAll();
    }

    /**
     * Find a project task by ID
     */
    @Transactional
    public ProjectTask findById(Long id) {
        try {
            return projectTaskRepository.getById(id);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Delete a project task by ID
     */
    @Transactional
    public void delete(Long id) {
        ProjectTask projectTask = findById(id);
        if (projectTask != null) {
            projectTaskRepository.delete(projectTask);
        }
    }

    /**
     * Delete all tasks in a specific column
     */
    @Transactional
    public void deleteTasksByColumnId(String columnId) {
        Iterable<ProjectTask> allTasks = findAll();
        for (ProjectTask task : allTasks) {
            if (task.getStatus() != null && task.getStatus().equals(columnId)) {
                projectTaskRepository.delete(task);
            }
        }
    }
}

