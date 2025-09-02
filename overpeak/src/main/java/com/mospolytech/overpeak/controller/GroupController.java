package com.mospolytech.overpeak.controller;


import com.mospolytech.overpeak.dto.GroupDto;
import com.mospolytech.overpeak.domain.Group;
import com.mospolytech.overpeak.service.GroupService;
import com.mospolytech.overpeak.service.MapperDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public ResponseEntity<List<GroupDto>> getAll() {
        List<GroupDto> groups = groupService.findAll()
                .stream()
                .map(MapperDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(groups);
    }
    @GetMapping("mountain/{id}")
    public ResponseEntity<List<GroupDto>> getByMountainOrderedDate(@PathVariable Long id) {
        List<GroupDto> groups = groupService.findGroupsByMountainOrdered(id)
                .stream()
                .map(MapperDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDto> getById(@PathVariable Long id) {
        Group group = groupService.findById(id);
        return ResponseEntity.ok(MapperDto.toDto(group));
    }

    @PostMapping
    public ResponseEntity<GroupDto> create(@RequestBody GroupDto dto) {
        Group group = Group.builder()
                .name(dto.getName())
                .build();
        Group saved = groupService.insert(group);
        return ResponseEntity.ok(MapperDto.toDto(saved));
    }
}
