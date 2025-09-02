package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Group;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupService {

    Group findById(Long id);

    Group findByName(String name);

    List<Group> findAll();

    Group insert(Group group);

    Group update(Group group);

    List<Group> findGroupsByMountainOrdered(@Param("mountainId") long mountainId);
}

