package com.projectAPI.projectAPI.web;

import com.projectAPI.projectAPI.domain.Column;
import com.projectAPI.projectAPI.service.ColumnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/columns")
@CrossOrigin
public class ColumnController {

    @Autowired
    private ColumnService columnService;

    @GetMapping("/all")
    public Iterable<Column> getAllColumns() {
        // Initialize default columns if none exist
        columnService.initializeDefaultColumns();
        return columnService.findAll();
    }

    @GetMapping("/{column_id}")
    public ResponseEntity<?> getColumnById(@PathVariable String column_id) {
        Column column = columnService.findById(column_id);
        if (column == null) {
            return new ResponseEntity<>("Column not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(column, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> addColumn(@Valid @RequestBody Column column, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errorMap = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errorMap.put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
        }

        // Check if column title already exists
        if (columnService.existsByTitle(column.getTitle())) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("title", "Column with this name already exists");
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
        }

        Column newColumn = columnService.saveOrUpdateColumn(column);
        return new ResponseEntity<>(newColumn, HttpStatus.CREATED);
    }

    @DeleteMapping("/{column_id}")
    public ResponseEntity<?> deleteColumn(@PathVariable String column_id) {
        Column column = columnService.findById(column_id);
        if (column == null) {
            return new ResponseEntity<>("Column not found", HttpStatus.NOT_FOUND);
        }

        if (column.isDefault()) {
            return new ResponseEntity<>("Cannot delete default columns", HttpStatus.BAD_REQUEST);
        }

        columnService.deleteColumnAndTasks(column_id);
        return new ResponseEntity<>("Column and associated tasks deleted", HttpStatus.OK);
    }
}
