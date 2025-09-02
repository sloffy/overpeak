package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Mountain;
import com.mospolytech.overpeak.dto.MountainClimbersCountDto;
import com.mospolytech.overpeak.exception.MountainAlreadyExistsException;
import com.mospolytech.overpeak.exception.MountainNotFoundException;
import com.mospolytech.overpeak.repository.ExpeditionRepository;
import com.mospolytech.overpeak.repository.MountainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MountainServiceImpl implements MountainService {

    private final MountainRepository mountainRepository;
    private final ExpeditionRepository expeditionRepository;

    @Override
    @Transactional(readOnly = true)
    public Mountain findById(long id) {
        return mountainRepository.findById(id)
                .orElseThrow(() -> new MountainNotFoundException("Mountain with id " + id + " not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Mountain> findAll() {
        return mountainRepository.findAll();
    }

    @Override
    @Transactional
    public Mountain insert(Mountain mountain) {
        if (mountainRepository.findByName(mountain.getName()).isPresent()) {
            throw new MountainAlreadyExistsException("Mountain with name " + mountain.getName() + " already exists");
        }
        return mountainRepository.save(mountain);
    }

    @Override
    @Transactional
    public Mountain update(Mountain mountain) {
        Mountain existing = mountainRepository.findById(mountain.getId())
                .orElseThrow(() -> new MountainNotFoundException("Mountain with id " + mountain.getId() + " not found"));

        boolean hasExpeditions = expeditionRepository.findByMountainId(existing.getId()).isPresent();
        if (hasExpeditions) {
            throw new MountainAlreadyExistsException("Cannot update mountain, expeditions already exist");
        }

        existing.setName(mountain.getName());
        existing.setHeight(mountain.getHeight());
        existing.setRegion(mountain.getRegion());
        return mountainRepository.save(existing);
    }

    @Override
    public Mountain findByName(String mountainName) {
        return mountainRepository.findByName(mountainName).orElseThrow(() ->
                new MountainNotFoundException("mountain with name " + mountainName + " was not found"));

    }
    public List<MountainClimbersCountDto> getClimberCountsPerMountain() {
        return mountainRepository.countClimbersPerMountain()
                .stream()
                .map(r -> new MountainClimbersCountDto(
                        ((Number) r[0]).longValue(),
                        (String) r[1],
                        ((Number) r[2]).longValue()
                ))
                .collect(Collectors.toList());
    }
    
}
