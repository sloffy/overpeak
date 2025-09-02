package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Climber;
import com.mospolytech.overpeak.domain.Group;
import com.mospolytech.overpeak.domain.GroupClimber;
import com.mospolytech.overpeak.domain.GroupClimberId;
import com.mospolytech.overpeak.dto.ClimberMountainAscentsDto;
import com.mospolytech.overpeak.exception.ClimberNotFoundException;
import com.mospolytech.overpeak.exception.GroupNotFoundException;
import com.mospolytech.overpeak.repository.ClimberRepository;
import com.mospolytech.overpeak.repository.ExpeditionRepository;
import com.mospolytech.overpeak.repository.GroupClimberRepository;
import com.mospolytech.overpeak.repository.GroupRepository;
import com.mospolytech.overpeak.service.ClimberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClimberServiceImpl implements ClimberService {

    private final ClimberRepository climberRepository;
    private final GroupRepository groupRepository;
    private final GroupClimberRepository groupClimberRepository;


    @Transactional(readOnly = true)
    @Override
    public Climber findById(long id) {
        return climberRepository.findById(id)
                .orElseThrow(() -> new ClimberNotFoundException("Climber with id " + id + " not found"));
    }

    @Override
    @Transactional
    public Climber insert(Climber climber) {
        return climberRepository.save(climber);
    }

    @Override
    @Transactional
    public void addClimberToGroup(long climberId, long groupId, LocalDate joinDate) {
        Climber climber = climberRepository.findById(climberId)
                .orElseThrow(() -> new ClimberNotFoundException("Climber with id " + climberId + " not found"));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with id " + groupId + " not found"));

        GroupClimber gc = new GroupClimber();
        gc.setId(new GroupClimberId(groupId, climberId));
        gc.setClimber(climber);
        gc.setGroup(group);
        gc.setJoinDate(joinDate);

        groupClimberRepository.save(gc);
    }

    @Override
    public List<Climber> getClimbersByDateRange(LocalDate start, LocalDate end) {
        return climberRepository.findClimbersByExpeditionInterval(start, end);
    }

    public List<ClimberMountainAscentsDto> getAscentsPerClimberPerMountain() {
        return climberRepository.countAscentsPerClimberPerMountain()
                .stream()
                .map(r -> new ClimberMountainAscentsDto(
                        ((Number) r[0]).longValue(),
                        ((Number) r[1]).longValue(),
                        ((Number) r[2]).longValue()
                ))
                .collect(Collectors.toList());
    }
}

