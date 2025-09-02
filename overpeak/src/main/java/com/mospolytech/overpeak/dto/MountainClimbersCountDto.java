package com.mospolytech.overpeak.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MountainClimbersCountDto {
    private Long mountainId;
    private String mountainName;
    private Long climbersCount;
}