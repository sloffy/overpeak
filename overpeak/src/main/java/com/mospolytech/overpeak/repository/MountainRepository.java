package com.mospolytech.overpeak.repository;

import com.mospolytech.overpeak.domain.Mountain;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MountainRepository extends JpaRepository<Mountain, Long> {

    Optional<Mountain> findByName(String name);

    @Override
    @EntityGraph(attributePaths = {"region", "region.country"})
    java.util.List<Mountain> findAll();

    void deleteByName(String name);

    @Query("SELECT m.id, m.name, COUNT(DISTINCT gc.climber.id) " +
            "FROM Expedition e " +
            "JOIN e.group g " +
            "JOIN g.members gc " +
            "JOIN e.mountain m " +
            "GROUP BY m.id, m.name " +
            "ORDER BY m.name ASC")
    List<Object[]> countClimbersPerMountain();

}
