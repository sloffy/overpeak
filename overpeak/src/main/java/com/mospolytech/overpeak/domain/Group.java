package com.mospolytech.overpeak.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupClimber> members;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<Expedition> expeditions;

    @Override
    public String toString() {
        return "id=" + id +
                ", name='" + name + '\'' +
                ", creationDate=" + creationDate +
                ", members=" + members +
                '}';
    }
}
