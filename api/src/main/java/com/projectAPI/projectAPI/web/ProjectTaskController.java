package com.projectAPI.projectAPI.web;

import com.projectAPI.projectAPI.domain.ProjectTask;
import com.projectAPI.projectAPI.service.ProjectTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@CrossOrigin
public class ProjectTaskController {

    @Autowired
    private ProjectTaskService projectTaskService;

    @PostMapping("")
    public ResponseEntity<?> addPT(@Valid  @RequestBody ProjectTask projectTask, BindingResult bindingResult){

       if(bindingResult.hasErrors()){
           Map<String, String> errorMap = new HashMap<>();

           for(FieldError error: bindingResult.getFieldErrors()){
               errorMap.put(error.getField(), error.getDefaultMessage());
           }
           return new ResponseEntity<Map<String, String>>(errorMap, HttpStatus.BAD_REQUEST);
       }
        ProjectTask newPT = projectTaskService.saveOrUpdateProjectTask(projectTask);

        return new ResponseEntity<ProjectTask>(newPT, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public Iterable<ProjectTask> getAllPTs (){
    return projectTaskService.findAll();
    };

    @GetMapping("/{pt_id}")
    public ResponseEntity<?> getPTById(@PathVariable Long pt_id ){
      ProjectTask projectTask = projectTaskService.findById(pt_id);
      if (projectTask == null) {
          return new ResponseEntity<String>("Project task not found", HttpStatus.NOT_FOUND);
      }
      return new ResponseEntity<ProjectTask>(projectTask, HttpStatus.OK);
    };

    @DeleteMapping("/{pt_id}")
    public ResponseEntity<?> deleteProjectTask(@PathVariable Long pt_id){
        ProjectTask projectTask = projectTaskService.findById(pt_id);
        if (projectTask == null) {
            return new ResponseEntity<String>("Project task not found", HttpStatus.NOT_FOUND);
        }
        projectTaskService.delete(pt_id);
        return new ResponseEntity<String>("Project task deleted", HttpStatus.OK);
    }
}
