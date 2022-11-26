package com.example.contestbackend.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "counties")

public class County {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCounty;
    private String countyName;
//    private String id_voivodeship;
}
