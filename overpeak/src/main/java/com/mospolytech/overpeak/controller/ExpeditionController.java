package com.mospolytech.overpeak.controller;

import com.mospolytech.overpeak.domain.ExpeditionStatus;
import com.mospolytech.overpeak.dto.ExpeditionDto;
import com.mospolytech.overpeak.domain.Expedition;
import com.mospolytech.overpeak.domain.Group;
import com.mospolytech.overpeak.domain.Mountain;
import com.mospolytech.overpeak.service.ExpeditionService;
import com.mospolytech.overpeak.service.GroupService;
import com.mospolytech.overpeak.service.MapperDto;
import com.mospolytech.overpeak.service.MountainService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expeditions")
@RequiredArgsConstructor
public class ExpeditionController {

    private final ExpeditionService expeditionService;
    private final MountainService mountainService;
    private final GroupService groupService;

    @GetMapping
    public ResponseEntity<List<ExpeditionDto>> getAll() {
        List<ExpeditionDto> expeditions = expeditionService.findAll()
                .stream()
                .map(MapperDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(expeditions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpeditionDto> getById(@PathVariable Long id) {
        Expedition expedition = expeditionService.findById(id);
        return ResponseEntity.ok(MapperDto.toDto(expedition));
    }

    @PostMapping
    public ResponseEntity<ExpeditionDto> create(@RequestBody ExpeditionDto dto) {
        Mountain mountain = mountainService.findByName(dto.getMountainName());
        Group group = groupService.findByName(dto.getGroupName());

        Expedition expedition = Expedition.builder()
                .name(dto.getName())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus() != null ? Enum.valueOf(ExpeditionStatus.class, dto.getStatus()) : null)
                .mountain(mountain)
                .group(group)
                .build();

        Expedition saved = expeditionService.insert(expedition);
        return ResponseEntity.ok(MapperDto.toDto(saved));
    }

    @GetMapping("/range")
    public ResponseEntity<List<ExpeditionDto>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        List<ExpeditionDto> expeditions = expeditionService.findByDateRange(start, end)
                .stream()
                .map(MapperDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(expeditions);
    }

    @GetMapping("/by-period")
    public ResponseEntity<List<ExpeditionDto>> getExpeditionsByPeriod(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(expeditionService.getExpeditionsInPeriod(start, end));
    }
}
