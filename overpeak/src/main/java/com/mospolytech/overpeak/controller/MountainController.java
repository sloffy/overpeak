package com.mospolytech.overpeak.controller;

import com.mospolytech.overpeak.dto.MountainClimbersCountDto;
import com.mospolytech.overpeak.dto.MountainDto;
import com.mospolytech.overpeak.domain.Mountain;
import com.mospolytech.overpeak.service.MapperDto;
import com.mospolytech.overpeak.service.MountainService;
import com.mospolytech.overpeak.service.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mountains")
@RequiredArgsConstructor
public class MountainController {

    private final MountainService mountainService;
    private final RegionService regionService;

    @GetMapping
    public ResponseEntity<List<MountainDto>> getAllMountains() {
        List<MountainDto> mountains = mountainService.findAll()
                .stream()
                .map(MapperDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mountains);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MountainDto> getMountainById(@PathVariable Long id) {
        Mountain mountain = mountainService.findById(id);
        return ResponseEntity.ok(MapperDto.toDto(mountain));
    }

    @PostMapping
    public ResponseEntity<MountainDto> createMountain(@RequestBody MountainDto dto) {
        Mountain mountain = Mountain.builder()
                .name(dto.getName())
                .height(dto.getHeight())
                .region(regionService.findByName(dto.getRegion()))
                .build();
        Mountain saved = mountainService.insert(mountain);
        return ResponseEntity.ok(MapperDto.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MountainDto> updateMountain(@PathVariable Long id, @RequestBody MountainDto dto) {
        Mountain mountain = Mountain.builder()
                .id(id)
                .name(dto.getName())
                .height(dto.getHeight())
                .region(regionService.findByName(dto.getRegion()))
                .build();
        Mountain updated = mountainService.update(mountain);
        return ResponseEntity.ok(MapperDto.toDto(updated));
    }

    @GetMapping("/climbers-count")
    public ResponseEntity<List<MountainClimbersCountDto>> getClimberCounts() {
        return ResponseEntity.ok(mountainService.getClimberCountsPerMountain());
    }
}
