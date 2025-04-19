package com.projectAPI.projectAPI.service;

import com.projectAPI.projectAPI.domain.ProjectTask;
import com.projectAPI.projectAPI.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectTaskService {
    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    public ProjectTask saveOrUpdateProjectTask(ProjectTask projectTask){

        if(projectTask.getStatus()==null || projectTask.getStatus()==""){
            projectTask.setStatus("TO_DO");
        }
        return projectTaskRepository.save(projectTask);
    }

    public Iterable<ProjectTask> findAll(){
        return projectTaskRepository.findAll();
    }

    @Transactional
    public ProjectTask findById(Long id){
        try {
            return projectTaskRepository.getById(id);
        } catch (Exception e) {
            return null;
        }
    }

    public void delete(Long id){
        ProjectTask projectTask = findById(id);
        if (projectTask != null) {
            projectTaskRepository.delete(projectTask);
        }
    }
}

