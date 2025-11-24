package com.mospolytech.overpeak.repository;

import com.mospolytech.overpeak.domain.Group;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    Optional<Group> findByName(String name);

    @Override
    @EntityGraph(attributePaths = {"members", "members.climber"})
    java.util.List<Group> findAll();

    @Query("SELECT DISTINCT g FROM Group g " +
            "JOIN g.expeditions e " +
            "JOIN e.mountain m " +
            "WHERE m.id = :mountainId " +
            "ORDER BY e.startDate ASC")
    @EntityGraph(attributePaths = {"members", "members.climber"})
    List<Group> findGroupsByMountainOrdered(@Param("mountainId") long mountainId);

}
