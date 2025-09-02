package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Group;
import com.mospolytech.overpeak.exception.GroupNotFoundException;
import com.mospolytech.overpeak.exception.GroupAlreadyExistsException;
import com.mospolytech.overpeak.repository.GroupRepository;
import com.mospolytech.overpeak.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    @Override
    @Transactional(readOnly = true)
    public Group findById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new GroupNotFoundException("Group with id " + id + " not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Group findByName(String name) {
        return groupRepository.findByName(name)
                .orElseThrow(() -> new GroupNotFoundException("Group with name '" + name + "' not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Group> findAll() {
        return groupRepository.findAll();
    }

    @Override
    @Transactional
    public Group insert(Group group) {
        if (groupRepository.findByName(group.getName()).isPresent()) {
            throw new GroupAlreadyExistsException("Group with name '" + group.getName() + "' already exists");
        }
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public Group update(Group group) {
        Group existing = findById(group.getId()); // выбросит исключение, если не найден
        existing.setName(group.getName());
        return groupRepository.save(existing);
    }

    @Override
    public List<Group> findGroupsByMountainOrdered(long mountainId) {
        return groupRepository.findGroupsByMountainOrdered(mountainId);
    }
}