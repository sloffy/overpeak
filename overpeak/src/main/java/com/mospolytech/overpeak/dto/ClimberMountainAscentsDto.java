package com.mospolytech.overpeak.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClimberMountainAscentsDto {
    private Long climberId;
    private Long mountainId;
    private Long ascents;
}

