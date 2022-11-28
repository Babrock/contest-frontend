package com.example.contestbackend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

import static javax.persistence.CascadeType.ALL;

@Entity
@Getter
@Setter
@Table(name = "voivodeships")
public class Voivodeship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVoivodeship;
    private String voivodeshipName;
}
