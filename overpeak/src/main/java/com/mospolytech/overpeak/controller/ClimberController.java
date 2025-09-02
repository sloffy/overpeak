package com.mospolytech.overpeak.controller;

import com.mospolytech.overpeak.dto.ClimberDto;
import com.mospolytech.overpeak.domain.Climber;
import com.mospolytech.overpeak.dto.ClimberMountainAscentsDto;
import com.mospolytech.overpeak.service.ClimberService;
import com.mospolytech.overpeak.service.MapperDto;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/climbers")
@RequiredArgsConstructor
public class ClimberController {

    private final ClimberService climberService;
    @GetMapping("/by-dates")
    public ResponseEntity<List<ClimberDto>> getClimbersByDates(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        List<ClimberDto> climbers = climberService.getClimbersByDateRange(start, end)
                .stream()
                .map(MapperDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(climbers);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ClimberDto> getById(@PathVariable Long id) {
        Climber climber = climberService.findById(id);
        return ResponseEntity.ok(MapperDto.toDto(climber));
    }

    @PostMapping
    public ResponseEntity<ClimberDto> create(@RequestBody ClimberDto dto) {
        Climber climber = Climber.builder()
                .name(dto.getName())
                .surname(dto.getSurname())
                .address(dto.getAddress())
                .contactInfo(dto.getContactInfo())
                .build();
        Climber saved = climberService.insert(climber);
        return ResponseEntity.ok(MapperDto.toDto(saved));
    }

    @PostMapping("/{climberId}/group/{groupId}")
    public ResponseEntity<Void> addToGroup(@PathVariable Long climberId, @PathVariable Long groupId) {
        climberService.addClimberToGroup(climberId, groupId, LocalDate.now());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ascents")
    public ResponseEntity<List<ClimberMountainAscentsDto>> getAscentsPerClimberPerMountain() {
        return ResponseEntity.ok(climberService.getAscentsPerClimberPerMountain());
    }
}
