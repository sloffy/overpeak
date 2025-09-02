package com.mospolytech.overpeak.repository;

import com.mospolytech.overpeak.domain.GroupClimber;
import com.mospolytech.overpeak.domain.GroupClimberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupClimberRepository extends JpaRepository<GroupClimber, GroupClimberId> {

    List<GroupClimber> findByClimberId(Long climberId);

    List<GroupClimber> findByGroupId(Long groupId);

}
