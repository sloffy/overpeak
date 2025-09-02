package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Mountain;
import com.mospolytech.overpeak.dto.MountainClimbersCountDto;

import java.util.List;

public interface MountainService {
    Mountain findById(long id);
    List<Mountain> findAll();
    Mountain insert(Mountain mountain);
    Mountain update(Mountain mountain);
    Mountain findByName(String mountainName);
    List<MountainClimbersCountDto> getClimberCountsPerMountain();
}

