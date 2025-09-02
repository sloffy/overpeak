package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Expedition;
import com.mospolytech.overpeak.dto.ExpeditionDto;

import java.time.LocalDate;
import java.util.List;

public interface ExpeditionService {
    Expedition findById(long id);
    List<Expedition> findAll();
    List<Expedition> findByMountainIdChronologically(long mountainId);
    List<Expedition> findByDateRange(LocalDate start, LocalDate end);
    Expedition insert(Expedition expedition);
    void deleteById(long id);
    List<ExpeditionDto> getExpeditionsInPeriod(LocalDate start, LocalDate end);
}

