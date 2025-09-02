package com.mospolytech.overpeak.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GroupClimberId implements Serializable {

    private Long groupId;

    private Long climberId;
}
