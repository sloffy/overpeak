package com.mospolytech.overpeak.service;


import com.mospolytech.overpeak.domain.*;
import com.mospolytech.overpeak.dto.ClimberDto;
import com.mospolytech.overpeak.dto.ExpeditionDto;
import com.mospolytech.overpeak.dto.GroupDto;
import com.mospolytech.overpeak.dto.MountainDto;

import java.util.stream.Collectors;

public class MapperDto {

    public static MountainDto toDto(Mountain mountain) {
        return MountainDto.builder()
                .id(mountain.getId())
                .name(mountain.getName())
                .height(mountain.getHeight())
                .region(mountain.getRegion() != null ? mountain.getRegion().getName() : null)
                .country(mountain.getRegion() != null && mountain.getRegion().getCountry() != null
                        ? mountain.getRegion().getCountry().getName() : null)
                .build();
    }

    public static ClimberDto toDto(Climber climber) {
        return ClimberDto.builder()
                .id(climber.getId())
                .name(climber.getName())
                .surname(climber.getSurname())
                .address(climber.getAddress())
                .contactInfo(climber.getContactInfo())
                .build();
    }

    public static GroupDto toDto(Group group) {
        return GroupDto.builder()
                .id(group.getId())
                .name(group.getName())
                .creationDate(group.getCreationDate() != null ? group.getCreationDate() : null)
                .members(group.getMembers().stream().map(gm -> toDto(gm.getClimber())).collect(Collectors.toList()))
                .build();
    }

    public static ExpeditionDto toDto(Expedition expedition) {
        return ExpeditionDto.builder()
                .id(expedition.getId())
                .name(expedition.getName())
                .startDate(expedition.getStartDate())
                .endDate(expedition.getEndDate())
                .status(expedition.getStatus() != null ? expedition.getStatus().name() : null)
                .mountainName(expedition.getMountain() != null ? expedition.getMountain().getName() : null)
                .groupName(expedition.getGroup() != null ? expedition.getGroup().getName() : null)
                .climbers(expedition.getGroup() != null ?
                        expedition.getGroup().getMembers().stream().map(gm -> toDto(gm.getClimber())).collect(Collectors.toList())
                        : null)
                .build();
    }
}
