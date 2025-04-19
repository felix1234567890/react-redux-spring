package com.projectAPI.projectAPI.repository;

import com.projectAPI.projectAPI.domain.Column;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColumnRepository extends CrudRepository<Column, String> {
    Column getById(String id);
}
