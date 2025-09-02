package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Climber;
import com.mospolytech.overpeak.dto.ClimberMountainAscentsDto;

import java.time.LocalDate;
import java.util.List;

public interface ClimberService {
    Climber findById(long id);
    Climber insert(Climber climber);
    void addClimberToGroup(long climberId, long groupId, LocalDate joinDate);
    List<Climber> getClimbersByDateRange(LocalDate start, LocalDate end);
    List<ClimberMountainAscentsDto> getAscentsPerClimberPerMountain();
}
