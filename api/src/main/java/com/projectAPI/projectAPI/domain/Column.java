package com.projectAPI.projectAPI.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "board_column") // Using "board_column" as table name since "column" is a reserved SQL keyword
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Column {

    @Id
    private String id;

    @NotBlank(message = "Column title is required")
    private String title;
    
    private String className;
    
    private boolean isDefault;

    public Column() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
}
