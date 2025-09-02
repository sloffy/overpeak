package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Expedition;
import com.mospolytech.overpeak.dto.ClimberDto;
import com.mospolytech.overpeak.dto.ExpeditionDto;
import com.mospolytech.overpeak.exception.ExpeditionNotFoundException;
import com.mospolytech.overpeak.repository.ExpeditionRepository;
import com.mospolytech.overpeak.service.ExpeditionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpeditionServiceImpl implements ExpeditionService {

    private final ExpeditionRepository expeditionRepository;

    @Override
    @Transactional(readOnly = true)
    public Expedition findById(long id) {
        return expeditionRepository.findById(id)
                .orElseThrow(() -> new ExpeditionNotFoundException("Expedition with id " + id + " not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expedition> findAll() {
        return expeditionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expedition> findByMountainIdChronologically(long mountainId) {
        return expeditionRepository.findByMountainIdOrderByStartDate(mountainId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expedition> findByDateRange(LocalDate start, LocalDate end) {
        return expeditionRepository.findByStartDateBetween(start, end);
    }

    @Override
    @Transactional
    public Expedition insert(Expedition expedition) {
        return expeditionRepository.save(expedition);
    }

    @Override
    @Transactional
    public void deleteById(long id) {
        if (!expeditionRepository.existsById(id)) {
            throw new ExpeditionNotFoundException("Expedition with id " + id + " not found");
        }
        expeditionRepository.deleteById(id);
    }

    public List<ExpeditionDto> getExpeditionsInPeriod(LocalDate start, LocalDate end) {
        return expeditionRepository.findExpeditionsInPeriod(start, end)
                .stream()
                .map(e -> ExpeditionDto.builder()
                        .id(e.getId())
                        .name(e.getName())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .status(e.getStatus().name())
                        .mountainName(e.getMountain().getName())
                        .groupName(e.getGroup().getName())
                        .climbers(e.getGroup().getMembers()
                                .stream()
                                .map(gc -> new ClimberDto(
                                        gc.getClimber().getId(),
                                        gc.getClimber().getName(),
                                        gc.getClimber().getSurname(),
                                        gc.getClimber().getAddress(),
                                        gc.getClimber().getContactInfo()
                                ))
                                .collect(Collectors.toList())
                        )
                        .build())
                .collect(Collectors.toList());
    }
}
