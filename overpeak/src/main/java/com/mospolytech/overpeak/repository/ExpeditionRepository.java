package com.mospolytech.overpeak.repository;

import com.mospolytech.overpeak.domain.Expedition;
import com.mospolytech.overpeak.domain.Mountain;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {

    @EntityGraph(attributePaths = {"group", "group.members", "mountain", "mountain.region", "mountain.region.country"})
    List<Expedition> findByMountainIdOrderByStartDate(Long mountainId);

    @EntityGraph(attributePaths = {"group", "group.members", "mountain"})
    List<Expedition> findByStartDateBetween(LocalDate start, LocalDate end);

    List<Expedition> findByGroupId(Long groupId);


    Optional<Expedition> findByMountainId(long id);
    @Query("SELECT e FROM Expedition e " +
            "WHERE e.startDate <= :end AND e.endDate >= :start " +
            "ORDER BY e.startDate ASC")
    List<Expedition> findExpeditionsInPeriod(@Param("start") LocalDate start,
                                             @Param("end") LocalDate end);
}
