package com.mospolytech.overpeak.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClimberDto {
    private Long id;
    private String name;
    private String surname;
    private String address;
    private String contactInfo;
}

