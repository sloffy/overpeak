package com.mospolytech.overpeak.repository;

import com.mospolytech.overpeak.domain.Climber;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClimberRepository extends JpaRepository<Climber, Long> {

    Optional<Climber> findByName(String name);

    @Override
    @EntityGraph(attributePaths = {"groupMemberships", "groupMemberships.group"})
    List<Climber> findAll();

    @Query("SELECT DISTINCT gc.climber " +
            "FROM Expedition e " +
            "JOIN e.group g " +
            "JOIN g.members gc " +
            "WHERE e.startDate <= :end AND e.endDate >= :start")
    List<Climber> findClimbersByExpeditionInterval(@Param("start") LocalDate start,
                                                   @Param("end") LocalDate end);
    @Query("SELECT c.id AS climberId, m.id AS mountainId, COUNT(e) AS ascents " +
            "FROM Expedition e " +
            "JOIN e.group g " +
            "JOIN g.members gc " +
            "JOIN gc.climber c " +
            "JOIN e.mountain m " +
            "GROUP BY c.id, m.id")
    List<Object[]> countAscentsPerClimberPerMountain();
}
