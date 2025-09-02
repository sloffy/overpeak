package com.mospolytech.overpeak.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MountainDto {
    private Long id;
    private String name;
    private int height;
    private String region;
    private String country;
}

