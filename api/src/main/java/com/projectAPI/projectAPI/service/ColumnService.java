package com.projectAPI.projectAPI.service;

import com.projectAPI.projectAPI.domain.Column;
import com.projectAPI.projectAPI.domain.ProjectTask;
import com.projectAPI.projectAPI.repository.ColumnRepository;
import com.projectAPI.projectAPI.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ColumnService {
    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private ProjectTaskService projectTaskService;

    /**
     * Initialize default columns if none exist
     */
    @Transactional
    public void initializeDefaultColumns() {
        if (columnRepository.count() == 0) {
            List<Column> defaultColumns = new ArrayList<>();

            Column todoColumn = new Column();
            todoColumn.setId("TO_DO");
            todoColumn.setTitle("TO DO");
            todoColumn.setClassName("bg-secondary");
            todoColumn.setDefault(true);
            defaultColumns.add(todoColumn);

            Column inProgressColumn = new Column();
            inProgressColumn.setId("IN_PROGRESS");
            inProgressColumn.setTitle("In Progress");
            inProgressColumn.setClassName("bg-primary");
            inProgressColumn.setDefault(true);
            defaultColumns.add(inProgressColumn);

            Column doneColumn = new Column();
            doneColumn.setId("DONE");
            doneColumn.setTitle("Done");
            doneColumn.setClassName("bg-success");
            doneColumn.setDefault(true);
            defaultColumns.add(doneColumn);

            columnRepository.saveAll(defaultColumns);
        }
    }

    /**
     * Check if a column with the given title already exists
     */
    public boolean existsByTitle(String title) {
        Iterable<Column> columns = columnRepository.findAll();
        for (Column column : columns) {
            if (column.getTitle().equalsIgnoreCase(title)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Save or update a column
     */
    public Column saveOrUpdateColumn(Column column) {
        // Set isDefault to false for new columns
        if (columnRepository.findById(column.getId()).isEmpty()) {
            column.setDefault(false);
        }
        return columnRepository.save(column);
    }

    public Iterable<Column> findAll() {
        return columnRepository.findAll();
    }

    @Transactional
    public Column findById(String id) {
        try {
            return columnRepository.getById(id);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Delete a column and all tasks in that column
     */
    @Transactional
    public void deleteColumnAndTasks(String id) {
        Column column = findById(id);

        if (column != null && !column.isDefault()) {
            // Find all tasks with this column's status
            Iterable<ProjectTask> allTasks = projectTaskRepository.findAll();
            List<ProjectTask> tasksToDelete = new ArrayList<>();

            for (ProjectTask task : allTasks) {
                if (task.getStatus() != null && task.getStatus().equals(id)) {
                    tasksToDelete.add(task);
                }
            }

            // Delete all tasks in this column
            projectTaskRepository.deleteAll(tasksToDelete);

            // Delete the column
            columnRepository.delete(column);
        }
    }
}
