package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Region;
import com.mospolytech.overpeak.exception.RegionNotFoundException;
import com.mospolytech.overpeak.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegionServiceImpl implements RegionService{

    private final RegionRepository regionRepository;

    @Override
    public Region findByName(String name) {
        return regionRepository.findByName(name).orElseThrow(
                () -> new RegionNotFoundException(
                        "Region with name " + name + " was not found"));
    }
}
